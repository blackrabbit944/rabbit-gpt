import { GptMessageType } from "@/types/openai";
import { getCache } from "./local";
// const fetch = require("node-fetch");

export interface sendRequestProps {
    modelName?: string;
    msgs: GptMessageType[];
    onText?: (data: { text: string; id: string }) => void;
    onFinished?: (data: { text: string; id: string }) => void;
    onError?: (error: Error) => void;
}

async function readOneRowFromOpenaiApi(line: string): string {
    ///移除data:前缀
    const json_data = line.replace(/^data:/, "");
    ///解析json

    if (json_data.trim() == "[DONE]") {
        return "";
    }

    try {
        const json = await JSON.parse(json_data);
        if (!json["choices"][0]["delta"]["content"]) {
            return "";
        }
        return json["choices"][0]["delta"]["content"];
    } catch (err) {
        console.log("debug-JSON报错了err", line);
        throw new Error("解析json失败");
        return "";
    }
}

export async function sendRequest(params: sendRequestProps): Promise<string> {
    const { modelName = "gpt-3.5-turbo", msgs, onText, onFinished, onError } = params;

    if (msgs.length === 0) {
        throw new Error("No messages provided");
    }

    const opeai_api_key = getCache("openai_api_key") || "";
    const model_name = getCache("model") || "gpt-3.5-turbo";
    // const api_url = "/api/gpt";
    const api_url =
        "https://gateway.ai.cloudflare.com/v1/d3c42400d063e65d9a797c7d4dba04e4/jianda/openai/chat/completions";

    try {
        const messages: GptMessageType[] = msgs.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));

        const response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + opeai_api_key,
            },
            body: JSON.stringify({
                messages,
                model: model_name,
                stream: true,
            }),
        });

        if (!response.ok) {
            console.log("[请求失败],response", response);
            throw new Error("请求接口失败");
        }

        if (!response.body) {
            throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const d = new TextDecoder("utf8");
        let fullText = "";

        ///获得一个32位随机数字+字母的id

        const gpt_msg_id = "gpt_" + Math.random().toString(36).substr(2);

        // eslint-disable-next-line no-constant-condition
        while (true) {
            // console.log("[debug-reader]", reader);
            const { value, done } = await reader.read();
            if (done) {
                if (onFinished) {
                    onFinished({
                        text: fullText,
                        id: gpt_msg_id,
                    });
                }
                break;
            } else {
                const raw = d.decode(value);

                try {
                    /// 有可能是多条数据,先用\n分割
                    let rows = raw.split("\n");

                    ///移除rows里面的空字符串
                    rows = rows.filter((item) => item.trim() !== "");

                    for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];

                        if (row.startsWith("data:")) {
                            const word = await readOneRowFromOpenaiApi(row);
                            fullText += word;
                            if (onText) {
                                onText({
                                    text: fullText,
                                    id: gpt_msg_id,
                                });
                            }
                        } else {
                            console.log("debug-JSON报错了row", row);
                        }
                    }
                } catch (err) {
                    // console.log('debug-JSON报错了err', err);
                    // console.log('debug-JSON报错了raw', raw);
                    // console.log('debug-JSON报错了json_data', json_data);
                    if (onError) {
                        if (err instanceof Error) {
                            onError(err);
                        } else {
                            onError(new Error("Unknown error"));
                        }
                    }
                }
            }
        }
        return fullText;
    } catch (error) {
        if (onError) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError(error as any);
        }
        throw error;
    }
}
