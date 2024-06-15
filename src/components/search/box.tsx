"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";

import { MessageType, PreMessageType } from "@/types/message";
import { useChatStore } from "@/store/chat";

import { getUnixtimestamp } from "@/helper/misc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Serper, { OrganicOneType } from "@/helper/serper";
import SearchMessageBox from "@/components/search/messageBox";

export default function SearchBox() {
    let defaultQuestion = "蛇为什么要蜕皮";

    let messagesEndRef = React.useRef<HTMLDivElement>(null);
    let chatInputRef = React.useRef<any>(null);

    let [result, setResult] = useState<OrganicOneType[]>([]);
    let [isInputFocus, setIsInputFocus] = useState<boolean>(false);
    let [tempQuestion, setTempQuestion] = useState<string>(defaultQuestion);
    let [question, setQuestion] = useState<string>(defaultQuestion);
    let [searchedQuestion, setSearchedQuestion] = useState<string>("");

    const serper = new Serper();

    const searchGoogle = async (q: string) => {
        const searchResult = await serper.search(q, 10);
        console.log("search result", result);
        if (searchResult.organic) {
            setResult(searchResult.organic);
        }
    };

    const beforeRecieveMessage = useChatStore((state) => state.beforeRecieveMessage);
    const recieveMessage = useChatStore((state) => state.recieveMessage);
    const recieveMessageSuccess = useChatStore((state) => state.recieveMessageSuccess);
    const recieveMessageError = useChatStore((state) => state.recieveMessageError);
    const addSendMessage = useChatStore((state) => state.addSendMessage);
    const activePromptKey = useChatStore((state) => state.activePromptKey);
    const clearMessageList = useChatStore((state) => state.clearMessageList);

    const chatList = useChatStore((state) => state.chat_list);
    const MessageData = chatList[activePromptKey];

    const MessageList = useMemo(() => {
        const MessageData = chatList[activePromptKey];
        return MessageData && MessageData["list"] ? MessageData["list"] : [];
    }, [activePromptKey, chatList]);

    const MessageStatus = MessageData && MessageData["status"] ? MessageData["status"] : "done";

    const getPreMessages = useCallback(() => {
        const NEXT_PUBLIC_GPT_PRE_MESSAGE_COUNT =
            process.env.NEXT_PUBLIC_GPT_PRE_MESSAGE_COUNT || "5";
        const NEXT_PUBLIC_GPT_PRE_MESSAGE_TIME =
            process.env.NEXT_PUBLIC_GPT_PRE_MESSAGE_TIME || "600";

        console.log("NEXT_PUBLIC_GPT_PRE_MESSAGE_TIME", NEXT_PUBLIC_GPT_PRE_MESSAGE_TIME);

        if (!NEXT_PUBLIC_GPT_PRE_MESSAGE_COUNT || !NEXT_PUBLIC_GPT_PRE_MESSAGE_TIME) {
            console.error(
                "请在.env文件中配置NEXT_PUBLIC_GPT_PRE_MESSAGE_COUNT和NEXT_PUBLIC_GPT_PRE_MESSAGE_TIME"
            );
            return [];
        }
        const max_message_count_require = parseInt(NEXT_PUBLIC_GPT_PRE_MESSAGE_COUNT);
        let max_message_time_require = parseInt(NEXT_PUBLIC_GPT_PRE_MESSAGE_TIME);

        console.log("max_message_time_require", max_message_time_require);

        ///找到message列表中发送时间小于Config中要求时间的消息
        let preMessages: MessageType[] = [];

        console.log("原始数据", MessageList);

        ///拿到messsage_rows的最后max_message_count_require条消息
        if (max_message_count_require) {
            if (MessageList) {
                preMessages = MessageList.slice(-max_message_count_require);
            }
        }

        if (max_message_time_require) {
            //获得当前时间的date对象,往前推5分钟
            const over_time = getUnixtimestamp() - max_message_time_require * 1000;

            if (preMessages) {
                preMessages = preMessages.filter((item) => {
                    //过滤create_time小于over_time的消息
                    if (item.timestamp) {
                        console.log(
                            "检查时间",
                            item.timestamp,
                            over_time,
                            item.timestamp > over_time
                        );
                        return item.timestamp > over_time;
                    } else {
                        return true;
                    }
                });
            }
        }

        if (!preMessages) {
            preMessages = [];
        }

        let preMessageOutput: PreMessageType[] = [];

        preMessages.forEach((item) => {
            preMessageOutput.push({
                content: item.content,
                role: item.from,
            });
        });

        return preMessageOutput;
    }, [MessageList]);

    const scrollToBottom = useCallback(() => {
        if (messagesEndRef && messagesEndRef.current) {
            setTimeout(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                        inline: "nearest",
                    });
                }
            }, 100);
        } else {
            setTimeout(scrollToBottom, 500);
        }
    }, [messagesEndRef]);

    useEffect(() => {
        if (MessageList.length > 0) {
            scrollToBottom();
        }
    }, [MessageList, scrollToBottom]);

    ///监听回车键
    useEffect(() => {
        if (isInputFocus) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                    setQuestion(tempQuestion);
                }
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isInputFocus, tempQuestion]);

    useEffect(() => {
        if (question && question != searchedQuestion) {
            console.log("问题改变了", question);
            setSearchedQuestion(question);
            searchGoogle(question);
        }
    }, [question, searchedQuestion, searchGoogle]);

    return (
        <div className="chatbox-wrapper">
            <div className="chat-search-title p-4 border-b theme-border-main bg-background">
                <Input
                    placeholder="输入你的问题"
                    className="large-input"
                    value={tempQuestion}
                    onChange={(e) => {
                        console.log("e", e.target.value);
                        setTempQuestion(e.target.value);
                    }}
                    onFocus={() => {
                        setIsInputFocus(true);
                    }}
                    onBlur={() => {
                        setIsInputFocus(false);
                    }}
                />
            </div>
            <div className="chat-search-middle">
                <div>
                    <div className="chat-search-chat">
                        <SearchMessageBox resultList={result} question={question} />
                        <div ref={messagesEndRef}></div>
                    </div>
                </div>
                <div>
                    <div className="organic-list">
                        {result.map((item, index) => {
                            return (
                                <a
                                    key={index}
                                    className="organic-one"
                                    href={item.link}
                                    target="_blank"
                                >
                                    <div className="organic-title">{item.title}</div>
                                    <div className="organic-desc">{item.snippet}</div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="chat-search-bottom"></div>
        </div>
    );
}
