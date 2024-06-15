import { Tiktoken } from "tiktoken/lite";
import cl100k_base from "tiktoken/encoders/cl100k_base.json";

interface ContentOneType {
    number: string;
    content: string;
}

export const calcTokenCount = (text: string) => {
    const encoding = new Tiktoken(
        cl100k_base.bpe_ranks,
        cl100k_base.special_tokens,
        cl100k_base.pat_str
    );
    const tokens = encoding.encode(text);
    encoding.free();
    return tokens.length;
};

export const cutContentLength = ({
    contentList,
    nowTokenCount,
    maxTokenCount,
}: {
    contentList: ContentOneType[];
    nowTokenCount: number;
    maxTokenCount: number;
}): ContentOneType[] => {
    ///计算需要裁剪长度的比例
    let ratio = maxTokenCount / nowTokenCount;

    let newContentList: ContentOneType[] = [];
    contentList.forEach((item) => {
        let newContent = item.content.slice(0, Math.floor(item.content.length * ratio));
        newContentList.push({ number: item.number, content: newContent });
    });

    return newContentList;
};
