"use client";

import ChatBox from "@/components/chat/box";
import LayoutMain from "@/components/layout/main";
import { useEffect } from "react";
import { getTheme, setThemeInCss } from "@/helper/local";

export default function ChatPage() {
    useEffect(() => {
        let theme = getTheme();
        setThemeInCss(theme);
    }, []);

    return (
        <LayoutMain>
            <ChatBox />
        </LayoutMain>
    );
}
