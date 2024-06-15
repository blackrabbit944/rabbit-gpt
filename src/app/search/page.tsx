"use client";
import { useState } from "react";
import SearchBox from "@/components/search/box";
import LayoutMain from "@/components/layout/main";
import { useEffect } from "react";
import { getTheme, setThemeInCss } from "@/helper/local";
import Serper, { OrganicOneType } from "@/helper/serper";

export default function ChatPage() {
    useEffect(() => {
        let theme = getTheme();
        setThemeInCss(theme);
    }, []);

    return (
        <LayoutMain>
            <SearchBox />
        </LayoutMain>
    );
}
