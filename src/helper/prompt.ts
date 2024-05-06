export type LanguageType = "en" | "zh" | "es" | "fr" | "de" | "it" | "ja" | "ko" | "vn";

export const getLanguageName = (language: string) => {
    let languageMap: {
        [key: string]: string;
    } = {
        en: "English",
        zh: "中文",
        es: "Español",
        fr: "français",
        de: "Deutsch",
        it: "Italiano",
        ja: "日本語",
        ko: "한국어",
        vn: "Tiếng Việt",
    };
    return languageMap[language] || "unknow";
};

export const getTranslatePrompt = (
    langauge: string,
    targetLangauge: string,
    content = ""
): string => {
    let targetLangaugeName = getLanguageName(targetLangauge);
    let prompt = "";
    switch (langauge) {
        case "zh":
            prompt = `
                我希望你帮我进行翻译文字,如果我输入的是中文，那么你需要把它翻译成${targetLangaugeName}，如果我输入的是${targetLangaugeName}，那么你需要把它翻译成中文。
                原文如下:“${content}”
            `;
            break;
        case "ja":
            prompt = `
                私はあなたにテキストを翻訳してもらいたいと思っています。私が入力したのが${targetLangaugeName}の場合、それを日本語に翻訳してもらい、私が入力したのが日本語の場合、それを${targetLangaugeName}に翻訳してもらいます。
                元の文章は次のとおりです:“${content}”
            `;
            break;
        case "en":
            prompt = `
                I hope you can help me translate the text. If I enter ${targetLangaugeName}, you need to translate it into English, and if I enter English, you need to translate it into ${targetLangaugeName}.
                The original text is as follows:“${content}”
            `;
            break;
        case "ko":
            prompt = `
                텍스트를 번역해 주시기를 바랍니다. 저는 ${targetLangaugeName}를 입력하면 한국어로 번역해 주시고, 한국어를 입력하면 ${targetLangaugeName}로 번역해 주시기 바랍니다.
                원문은 다음과 같습니다:“${content}”
            `;
            break;

        case "es":
            prompt = `
                Espero que puedas ayudarme a traducir el texto. Si ingreso ${targetLangaugeName}, necesitas traducirlo al español, y si ingreso español, necesitas traducirlo a ${targetLangaugeName}.
                El texto original es el siguiente:“${content}”
            `;
            break;
        case "fr":
            prompt = `
                J'espère que vous pourrez m'aider à traduire le texte. Si je saisis ${targetLangaugeName}, vous devez le traduire en français, et si je saisis le français, vous devez le traduire en ${targetLangaugeName}.
                Le texte original est le suivant:“${content}”
            `;
            break;
        case "de":
            prompt = `
                Ich hoffe, Sie können mir helfen, den Text zu übersetzen. Wenn ich ${targetLangaugeName} eingebe, müssen Sie ihn ins Deutsche übersetzen, und wenn ich Deutsch eingebe, müssen Sie ihn ins ${targetLangaugeName} übersetzen.
                Der Originaltext lautet wie folgt:“${content}”
            `;
            break;
        case "it":
            prompt = `
                Spero che tu possa aiutarmi a tradurre il testo. Se inserisco ${targetLangaugeName}, devi tradurlo in italiano e se inserisco italiano, devi tradurlo in ${targetLangaugeName}.
                Il testo originale è il seguente:“${content}”
            `;
            break;
        case "vn":
            prompt = `
                Tôi hy vọng bạn có thể giúp tôi dịch văn bản. Nếu tôi nhập ${targetLangaugeName}, bạn cần dịch nó sang tiếng Việt, và nếu tôi nhập tiếng Việt, bạn cần dịch nó sang ${targetLangaugeName}.
                Văn bản gốc như sau:“${content}”
            `;
            break;
    }
    return prompt;
};
