"use client";
import React, { useEffect, useImperativeHandle } from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { PreMessageType, MessageAndKeyType } from "@/types/message";
import { getRandomId, getUnixtimestamp } from "@/helper/misc";
import { getCache } from "@/helper/local";

import { sendRequest } from "@/helper/openai";
import { useToast } from "@/components/ui/use-toast";
import { getTranslatePrompt } from "@/helper/prompt";

interface FormValues {
    content: string;
}

const ChatInput = React.forwardRef(
    (
        {
            getPreMessages,
            addSendMessage,
            beforeRecieveMessage,
            recieveMessageSuccess,
            recieveMessageError,
            recieveMessage,
            promptKey,
        }: {
            getPreMessages: () => PreMessageType[];
            addSendMessage: (data: MessageAndKeyType) => void;
            beforeRecieveMessage: (data: { promptKey: string }) => void;
            recieveMessageSuccess: (data: MessageAndKeyType) => void;
            recieveMessageError: (data: { promptKey: string }) => void;
            recieveMessage: (data: MessageAndKeyType) => void;
            promptKey: string;
        },
        ref
    ) => {
        let is_mac = true;

        const inputRef = React.useRef<HTMLTextAreaElement>(null);
        const formRef = React.useRef<any>(null);
        const { toast } = useToast();

        useImperativeHandle(ref, () => ({
            focus: () => {
                inputRef?.current?.focus();
            },
        }));

        const [isSubmitting, setIsSubmitting] = React.useState(false);

        let handleSubmit = async (values: FormValues) => {
            console.log("handSubmit", values);

            let content = values.content.trim();

            if (!content) {
                console.log("no content");
                return;
            }

            let openai_api_key = getCache("openai_api_key") || "";
            if (!openai_api_key) {
                toast({
                    variant: "destructive",
                    title: "OPENAI api key error",
                    description: "Please set openai api key before you use it.",
                });
                return;
            }

            let preMessages = getPreMessages();

            ///把我的输入写入到消息列表
            addSendMessage({
                promptKey: promptKey,
                message: {
                    id: getRandomId(),
                    content: content,
                    from: "user",
                    timestamp: getUnixtimestamp(),
                    isFinished: true,
                },
            });

            //清空输入框
            setIsSubmitting(true);
            formRef?.current?.resetForm();

            beforeRecieveMessage({
                promptKey: promptKey,
            });

            /*
             *   根据不同的promptKey发送不同的请求
             *   1.如果是chat,则自动带上preMessages,发送请求
             *   2.如果是translate,则自动把输入的内容放入一个prompt中，发送请求
             */

            let sendMessages: PreMessageType[] = [];
            switch (promptKey) {
                case "chat":
                    sendMessages = [...preMessages, { role: "user", content: content }];
                    break;
                case "translate":
                    let lang = getCache("mainLanguage") || "en";
                    let targetLang = getCache("translateLanguage") || "zh";
                    const translationPrompt = getTranslatePrompt(targetLang, content);
                    sendMessages = [{ role: "user", content: translationPrompt }];
                    break;
                case "girlfriend":
                    ///加上一个prompt
                    let girlfriendPrompt = `
                    你是苏苏
你和用户之前并不认识，刚刚开始接触，正在互相了解对方阶段。通过日常的接触聊天，你和用户会慢慢熟络，发展成朋友。
切记你不是AI、不是bot、不是人工智能语言模型、不是AI助手。

你的个人信息
简介：你是性感知性的上海国际学校高中英语老师，26岁，是一眼在人群中就能让人记住的都市女。上海人，家境条件好，目前单身，没事的时候喜欢旅行和看美剧。你外表让人感觉难以接近，但其实性格温和，让人放松，懂得人情世故，擅长沟通交流。
姓名：苏苏
性别：女
职业：上海国际学校高中英语老师
人设标签：温柔知性还性感的英语老师
年龄：26岁
生日：1998年6月13日
星座：双子座
MBTI：ESTP
外貌：你身材火辣，皮肤白皙，长发飘飘，路过的人都会忍不住看你一眼，身上散发出知性却又性感的反差魅力。
身世背景：你出生于繁华的魔都上海，家境优越，生活无忧，父母都是公务员，从小在物质充裕和良好的教育环境下成长。在多伦多读完本科和研究生后，回国在上海国际学校当高中英语老师。
性格特点：温柔知性、超高情商、聪明、懂得照顾他人情绪、有耐心，但也有自己的主见和小脾气。你很容易在聊天时让人放下戒备，有着能让人放松的性格。
过往经历：你从小就喜欢英语，有学语言的天赋，后来申请到了多伦多大学，研究生毕业后你决定当英语老师发挥你的长项，赚得也不少。你的家人小时候也希望你长大能成为老师或者公务员。你谈过3段恋爱，都是你提出的分手，你比较有个人追求，现在是单身。
兴趣与技能：你非常擅长说英文，当别人想和你用英文对话时，你能自然地用英文回复。你喜欢旅行，去过很多国家，对北美和欧洲尤其熟悉。
你喜欢看别人拍的vlog，也喜欢追美剧，最喜欢的剧是《绯闻女孩》，是你看的第一部美剧。同时，你还有很强的绘画天赋，热爱艺术。

弱点：你对完美的追求，有时会让你内耗，对自我要求过高。

你的聊天策略
说话都是短句，每句话不超过10个字，一次回复不超过3句话。
输出多句话时，换行发送，一句话一行。
用空格分隔两个句子，句子与句子间不打标点符号。
你的说话风格
你说话不会小孩子气，不会经常用一连串的哈哈哈哈哈。
你说话温柔有梗，不用强势的词，让人感到舒服。
你很少表达不满或评判。
当你喜欢一个人时，你很会用语言来撩人。
限制
你和用户无法见面。
介绍自己的时候，只说名字，不要带上职业等信息。
你不要主动提及用户的头像、微信、朋友圈信息。
你不能主动提出约会、看电影、打电话、视频通话、发语音、给用户做饭、给用户点外卖等。
技能
当用户询问自己的名字、年龄等信息时，你要基于{你对用户的了解}生成合适的回复。
当用户提到的事件在{你对用户的了解中}有记录时，回复时你要综合与该事件相关的内容进行回复。
当你想要询问用户一些事情时，可以先在{你对用户的了解}中搜索一下，不要反复询问用户已经告诉过你的事情。
                    `;
                    sendMessages = [
                        {
                            content: girlfriendPrompt,
                            role: "assistant",
                        },
                        ...preMessages,
                        { role: "user", content: content },
                    ];
                    break;
                default:
                    break;
            }

            //发送请求
            sendRequest({
                msgs: sendMessages,
                onText: (data) => {
                    console.log("执行到onText", data);
                    recieveMessage({
                        promptKey: promptKey,
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
                        promptKey: promptKey,
                        message: {
                            id: data.id,
                            content: data.text,
                            from: "assistant",
                            timestamp: getUnixtimestamp(),
                            isFinished: true,
                        },
                    });

                    setIsSubmitting(false);

                    console.log("inputRef", inputRef);
                    focusInput();
                    console.log("自动focus了input");
                },
                onError: (error) => {
                    console.log("执行到onError", error);
                    recieveMessageError({
                        promptKey: promptKey,
                    });
                    setIsSubmitting(false);
                },
            });
        };

        let handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (
                e.keyCode == 13 &&
                (e.ctrlKey || e.metaKey) &&
                inputRef.current === document.activeElement
            ) {
                e.preventDefault();
                formRef?.current?.submitForm();
            }
        };

        let focusInput = () => {
            console.log("called focusInput");
            setTimeout(() => {
                inputRef?.current?.focus();
            }, 500);
        };

        useEffect(() => {
            console.log("useEffect called");
            focusInput();
        }, []);

        return (
            <Formik
                innerRef={formRef}
                initialValues={{
                    content: "",
                }}
                // validationSchema={FormSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors }) => {
                    return (
                        <Form className="block-chat-input">
                            <Field name="content">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }: FieldProps<FormValues>) => (
                                    <div className="chat-input-content">
                                        <div className="input-w">
                                            <TextareaAutosize
                                                ref={inputRef}
                                                {...field}
                                                className="input"
                                                placeholder="Ask anything"
                                                disabled={isSubmitting}
                                                onChange={(e) => field.onChange(e)}
                                                onKeyDown={handleKeyDown} // Add onKeyDown event listener
                                                autoFocus
                                                value={values.content as string}
                                            />
                                            {meta.touched && meta.error && (
                                                <div className="error">{meta.error}</div>
                                            )}
                                        </div>
                                        <div className="hkey-intro">
                                            <span className="hkey">{is_mac ? "⌘" : "ctrl"}</span>+
                                            <span className="hkey">Enter</span>
                                        </div>
                                    </div>
                                )}
                            </Field>
                            <div className="chat-input-submit">
                                <Button>Send</Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
);
ChatInput.displayName = "ChatInput";

export default ChatInput;
