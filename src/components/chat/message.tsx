"use client";
import classNames from "classnames";
import { getTheme, isDarkTheme } from "@/helper/local";
import ReactMarkdown from "react-markdown";
import { MessageType } from "@/types/message";

export default function Message({ msg }: { msg: MessageType }) {
    let theme = getTheme();
    let isDark = isDarkTheme(theme);
    let isMine = msg.from == "user";
    return (
        <div className={classNames("message-one", { "my-msg": isMine }, { "ai-msg": !isMine })}>
            <div className="ct">
                <div className={"username"}>{isMine ? "User" : "ChatGPT"}</div>
                <article
                    className={classNames(
                        "prose w-full max-w-full  prose-p:text-weak prose-ul:text-weak",
                        { "prose-invert": isDark }
                    )}
                >
                    <ReactMarkdown>{msg["content"]}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
}
