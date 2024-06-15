import { SparklesIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCache, getTheme, setTheme } from "@/helper/local";
import Image from "next/image";

export default function TranslateSetting({
    handleChangeLanguage,
    language,
}: {
    handleChangeLanguage: (name: string) => void;
    language: string;
}) {
    let languageMap: {
        [key: string]: {
            name: string;
            flag: string;
        };
    } = {
        en: {
            name: "English",
            flag: "us",
        },
        zh: {
            name: "中文",
            flag: "cn",
        },
        es: {
            name: "Español",
            flag: "es",
        },
        fr: {
            name: "français",
            flag: "fr",
        },
        de: {
            name: "Deutsch",
            flag: "de",
        },
        it: {
            name: "Italiano",
            flag: "it",
        },
        ja: {
            name: "日本語",
            flag: "jp",
        },
        ko: {
            name: "한국어",
            flag: "kr",
        },
        vn: {
            name: "Tiếng Việt",
            flag: "vn",
        },
    };

    ///显示的语言
    let showLanguage = languageMap[language] || {
        name: "unknow",
        flag: "us",
    };

    return (
        <div className="block-language-select">
            <Select onValueChange={handleChangeLanguage} value={language}>
                <SelectTrigger>
                    <div className="theme-select-trigger">
                        <Image
                            src={"/flag/" + showLanguage["flag"] + ".svg"}
                            alt="flag"
                            className="flag"
                            width={20}
                            height={20}
                        />
                        <div className="text hidden sm:flex">{showLanguage["name"]}</div>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(languageMap).map((key: string) => (
                        <SelectItem key={key} value={key}>
                            <div className="flex justify-start items-center gap-2">
                                <Image
                                    src={"/flag/" + languageMap[key]["flag"] + ".svg"}
                                    alt="flag"
                                    className="flag"
                                    width={20}
                                    height={20}
                                />
                                {languageMap[key]["name"]}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
