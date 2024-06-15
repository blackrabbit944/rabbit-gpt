import React, { useCallback, useEffect, useState, useMemo } from "react";
import { OrganicOneType } from "@/helper/serper";
import { getApiUrl } from "@/helper/misc";
import { getCache, setCache } from "@/helper/local";
import md5 from "md5";
import SearchStatus from "./searchStatus";
import { calcTokenCount, cutContentLength } from "@/helper/tiktoken";
import { PreMessageType, MessageAndSearchKeyType } from "@/types/message";
import { getSearchPrompt } from "@/helper/prompt";
import { sendRequest } from "@/helper/openai";
import { useSearchStore } from "@/store/search";
import { getUnixtimestamp } from "@/helper/misc";
import classNames from "classnames";
import ReactMarkdown from "react-markdown";
import { MessageType } from "@/types/message";
import { getTheme, isDarkTheme } from "@/helper/local";

interface MessageBoxProps {
    resultList: OrganicOneType[];
    question: string;
}

type PageStatus = "waiting" | "finished" | "waitingGpt" | "finishedGpt";
interface ContentOneType {
    number: string;
    content: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({ resultList, question }) => {
    /*1.页面有几个步骤:
    1.1. 通过我们提供的api获得前5个页面的数据,等到至少3个返回的时候去请求Gpt总结这些数据
    1.2. 通过Gpt返回的数据,将数据展示在页面上

    2.页面可能的状态有:
    2.1. 获得搜索数据,正在等待页面数据 (等待页面数据1/5)这样,比如一共请求了5个,但是只有1个返回了
    2.2. 获得搜索数据,完成了基本的页面数据获得
    2.3. 获得搜索数据,正在等待Gpt总结数据
    2.4. 获得搜索数据,完成了Gpt总结数据获得
    */
    let theme = getTheme();
    let isDark = isDarkTheme(theme);

    let maxContentLength: number = Number(process.env.NEXT_PUBLIC_SEARCH_GET_CONTENT_LIMIT) || 5;
    let maxContentFinished: number = Number(process.env.NEXT_PUBLIC_SEARCH_GET_CONTENT_FINISH) || 3;
    let maxWaitingTime: number = Number(process.env.NEXT_PUBLIC_SEARCH_GET_CONTENT_TIME) || 600;

    let [pageStatus, setPageStatus] = React.useState<PageStatus>("waiting");
    let [totalContentCount, setTotalContentCount] = React.useState<number>(0);
    let [finisheContentCount, setFinisheContentCount] = React.useState<number>(0);
    let [contentList, setContentList] = React.useState<ContentOneType[]>([]);
    let [searchKey, setSearchKey] = React.useState<string>(md5(question.trim()));

    const beforeRecieveMessage = useSearchStore((state) => state.beforeRecieveMessage);
    const recieveMessage = useSearchStore((state) => state.recieveMessage);
    const recieveMessageSuccess = useSearchStore((state) => state.recieveMessageSuccess);
    const recieveMessageError = useSearchStore((state) => state.recieveMessageError);
    const searchList = useSearchStore((state) => state.searchList);

    useEffect(() => {
        let key = md5(question.trim());
        setSearchKey(key);
    }, [question]);

    const MessageList = useMemo(() => {
        const MessageData = searchList[searchKey];
        return MessageData && MessageData["list"] ? MessageData["list"] : [];
    }, [searchKey, searchList]);

    const resetPageStatus = () => {
        setPageStatus("waiting");
        setFinisheContentCount(0);
        setContentList([]);
    };

    const getContent = async (link: string): content => {
        ///判断本地是否有缓存
        let cacheKey = md5(link);
        let cacheContent = getCache(cacheKey);
        if (cacheContent) {
            let data = JSON.parse(cacheContent);
            return data.content;
        }

        console.log("debug-没有缓存", link);
        ///请求http://127.0.0.1:3000/spider/getContent?url=link获得内容
        let api_url = getApiUrl("/spider/fetch_main_content");
        let response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: link }),
        });

        let data = await response.json();
        console.log("debug-获得数据", data);
        if (data && data.status == 200) {
            setCache(cacheKey, JSON.stringify(data.data));
        }
        return data.content;
    };

    const runGetContent = useCallback(async () => {
        ///把resultList前maxContentLength个数据都请求一遍
        let maxContent = resultList.slice(0, maxContentLength);
        setTotalContentCount(maxContent.length);

        let contentList: ContentOneType[] = [];
        let finishCount = 0;

        console.log("准备获得", maxContent.length, "个内容");
        for (let i = 0; i < maxContent.length; i++) {
            let item = maxContent[i];
            let content = await getContent(item.link);
            contentList.push({ number: i.toString(), content: content });
            finishCount++;
            setFinisheContentCount(finishCount);

            if (finishCount >= maxContentFinished) {
                setPageStatus("finished");
                setContentList(contentList);
                break;
            }
        }
        setContentList(contentList);
    }, [resultList, maxContentLength, maxContentFinished]);

    useEffect(() => {
        if (resultList.length > 0) {
            setPageStatus("finished");
        } else {
            setPageStatus("waiting");
        }
    }, [resultList]);

    ///当页面resultList发生变化的时候,我们需要重新设置页面状态
    React.useEffect(() => {
        console.log("页面数据发生变化", resultList);
        if (resultList.length > 0) {
            resetPageStatus();
        }

        ///begin to get content
        if (resultList.length > 0) {
            runGetContent();
        }
    }, [resultList]);

    React.useEffect(() => {
        if (finisheContentCount >= maxContentFinished) {
            setPageStatus("waitingGpt");

            ///请求Gpt总结数据
            askGptForAnswer({
                contentList: contentList,
            });
        }
    }, [finisheContentCount, maxContentFinished, contentList]);

    const askGptForAnswer = useCallback(
        ({ contentList }: { contentList: ContentOneType[] }) => {
            if (MessageList.length > 0) {
                setPageStatus("finishedGpt");
                return;
            }
            console.log("askGptForAnswer", contentList);

            ///首先我们把问题获得一个key

            ///然后我们把问题和内容发送给Gpt

            ///把每一个内容拼成一个发字符串
            let newContentList: ContentOneType[] = [];
            contentList.forEach((item) => {
                ///最多每个网页只取2000个字符串
                if (item.content && item.content.length > 2000) {
                    newContentList.push({
                        number: item.number,
                        content: item.content.slice(0, 2000),
                    });
                } else {
                    newContentList.push(item);
                }
            });
            console.log("newContentList", newContentList);

            // ///计算token是否超过了数量

            // let newContentList: ContentOneType[] = [];
            // if (token_count > 20000) {
            //     console.log("token_count大于20000个token", token_count);
            //     ///裁剪数据,裁剪方案是把3个数据中每一个都按比例裁剪
            //     newContentList = cutContentLength({
            //         contentList: contentList,
            //         nowTokenCount: token_count,
            //         maxTokenCount: 20000,
            //     });
            // } else {
            //     newContentList = contentList;
            // }

            // ////把newContentList发送给Gpt
            let promptTemplate = getSearchPrompt(newContentList, question);

            beforeRecieveMessage({
                searchKey: searchKey,
            });

            sendRequest({
                msgs: [
                    {
                        role: "user",
                        content: promptTemplate,
                    },
                ],
                onText: (data) => {
                    console.log("执行到onText", data);
                    recieveMessage({
                        searchKey: searchKey,
                        message: {
                            id: data.id,
                            content: data.text,
                            from: "assistant",
                            timestamp: getUnixtimestamp(),
                            isFinished: false,
                        },
                    });
                },
                onFinished: (data) => {
                    console.log("执行到onFinished", data);
                    recieveMessageSuccess({
                        searchKey: searchKey,
                        message: {
                            id: data.id,
                            content: data.text,
                            from: "assistant",
                            timestamp: getUnixtimestamp(),
                            isFinished: true,
                        },
                    });
                    setPageStatus("finishedGpt");
                },
                onError: (error) => {
                    recieveMessageError({
                        searchKey: searchKey,
                    });
                    setPageStatus("finishedGpt");
                },
            });
        },
        [searchKey, MessageList]
    );

    return (
        <div>
            <SearchStatus
                status={pageStatus}
                finisheContentCount={finisheContentCount}
                maxContentFinishedCount={maxContentFinished}
            />
            <div className="block-box">
                {MessageList.map((item: MessageType) => {
                    return (
                        <div key={item.id} className="search-result-item">
                            <article
                                className={classNames(
                                    "prose w-full max-w-full  prose-p:text-weak prose-ul:text-weak",
                                    { "prose-invert": isDark }
                                )}
                            >
                                <ReactMarkdown>{item.content}</ReactMarkdown>
                            </article>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MessageBox;
