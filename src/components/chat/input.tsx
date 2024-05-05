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

            //发送请求
            sendRequest({
                msgs: [
                    ...preMessages,
                    {
                        role: "user",
                        content: content,
                    },
                ],
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
