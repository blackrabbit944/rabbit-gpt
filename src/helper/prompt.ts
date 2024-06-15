export type LanguageType = "en" | "zh" | "es" | "fr" | "de" | "it" | "ja" | "ko" | "vn";

export const getLanguageName = (language: string) => {
    let languageMap: {
        [key: string]: string;
    } = {
        en: "English",
        zh: "Chinese",
        es: "Spanish",
        fr: "French",
        de: "German",
        it: "Italian",
        ja: "Japanese",
        ko: "Korean",
        vn: "Vietnamese",
    };
    return languageMap[language] || "unknow";
};

export const getTranslatePrompt = (targetLangauge: string, content = ""): string => {
    let lang = getLanguageName(targetLangauge);
    let prompt = `
    You are a highly skilled AI trained in language translation. I would like you to translate the text delimited by triple quotes into ${lang} language, ensuring that the translation is colloquial and authentic.
    Only give me the output and nothing else. Do not wrap responses in quotes. 
    """
    ${content}
    """
    `;
    return prompt;
};

interface ContentOneType {
    number: string;
    content: string;
}

export const getSearchPrompt = (contentList: ContentOneType[], question): string => {
    let allContent: string = "";
    contentList.forEach((item, index) => {
        allContent += `
        网页编号:${item.number}
        内容:${item.content}
        ----
        `;
    });

    let prompt = `
    我现在给你几个网页的内容,请你按照我给你的内容,回到我提出的问题:
    ${allContent},
    我的问题是:
    """
    ${question}
    """,
    你回答的内容要尽量详细,谢谢!
    `;
    return prompt;
};
