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
