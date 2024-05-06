import React, { useCallback, useEffect } from "react";
import { getCache, getTheme, setCache, setTheme } from "@/helper/local";
import LanguageSelect from "@/components/setting/language";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
export default function TranslateSetting() {
    let languageMap = {
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

    const mainLanguage = getCache("mainLanguage") || "en";
    const translateLanguage = getCache("translateLanguage") || "zh";

    ///我的语言
    const [selectedLanguage, setSelectedLanguage] = React.useState(mainLanguage);

    ///翻译的语言
    const [selectedTranslateLanguage, setSelectedTranslateLanguage] =
        React.useState(translateLanguage);

    ///显示的语言

    return (
        <div className="block-translate-select">
            <LanguageSelect
                language={selectedLanguage}
                handleChangeLanguage={(v) => {
                    console.log("v", v);
                    setSelectedLanguage(v);
                    setCache("mainLanguage", v);
                }}
            />
            <ArrowsRightLeftIcon className="translate-icon" />
            <LanguageSelect
                language={selectedTranslateLanguage}
                handleChangeLanguage={(v) => {
                    console.log("v", v);
                    setSelectedTranslateLanguage(v);
                    setCache("translateLanguage", v);
                }}
            />
        </div>
    );
}
