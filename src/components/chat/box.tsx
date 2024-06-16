"use client";
import React, { useEffect, useState, useMemo, useCallback, use } from "react";

import ChatInput from "@/components/chat/input";
import { MessageType, PreMessageType } from "@/types/message";
import ChatMessage from "@/components/chat/message";
import { useChatStore } from "@/store/chat";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";
import { TrashIcon } from "@heroicons/react/24/outline";
import ModelSelect from "./modelSelect";
import { getUnixtimestamp } from "@/helper/misc";
import TranslateSetting from "@/components/setting/translate";
import MobileHeader from "@/components/mobile/header";

export default function ChatBox() {
    let messagesEndRef = React.useRef<HTMLDivElement>(null);
    let chatInputRef = React.useRef<any>(null);

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

    const [pageHeight, setPageHeight] = useState(0);
    useEffect(() => {
        setPageHeight(window.innerHeight);
        window.addEventListener("resize", () => {
            setPageHeight(window.innerHeight);
        });
        return () => {
            window.removeEventListener("resize", () => {
                setPageHeight(window.innerHeight);
            });
        };
    }, []);

    //想把pageHeight作为变量传给css中,可以用var(--page-height)的方式使用
    useEffect(() => {
        document.documentElement.style.setProperty("--js-page-height", `${pageHeight}px`);
    }, [pageHeight]);

    return (
        <div className="chatbox-wrapper">
            <div className="title">
                <div className="flex justify-start items-center">
                    <MobileHeader />
                    <h1 className="mr-4 font-roboto-condensed capitalize">{activePromptKey}</h1>
                </div>
                <div>
                    <div className="clean-btn" onClick={() => clearMessageList(activePromptKey)}>
                        <TrashIcon className="icon" />
                        <span className="text">clean chat</span>
                    </div>
                </div>
            </div>
            <div className="message-box relative">
                <div className="message-list">
                    {MessageList.map((one) => {
                        return <ChatMessage key={one.id} msg={one} />;
                    })}
                </div>
                {status == "waiting" ? (
                    <div className="block-writing">
                        <div className="icon">
                            <UseAnimations animation={loading} size={24} />
                        </div>
                        正在输入中...
                    </div>
                ) : null}
                <div ref={messagesEndRef} className="msg-end"></div>
            </div>
            <div className="bottom">
                <div className="setting-bar">
                    {activePromptKey == "translate" ? <TranslateSetting /> : null}
                    <ModelSelect />
                </div>
                <ChatInput
                    ref={chatInputRef}
                    getPreMessages={getPreMessages}
                    promptKey={activePromptKey}
                    beforeRecieveMessage={beforeRecieveMessage}
                    recieveMessage={recieveMessage}
                    recieveMessageSuccess={recieveMessageSuccess}
                    addSendMessage={addSendMessage}
                    recieveMessageError={recieveMessageError}
                />
            </div>
        </div>
    );
}
