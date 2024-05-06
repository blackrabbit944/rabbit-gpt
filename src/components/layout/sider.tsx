import Logo from "@/components/common/logo";
import {
    ChatBubbleOvalLeftIcon,
    LanguageIcon,
    MagnifyingGlassCircleIcon,
    Cog8ToothIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";

import SettingModal from "@/components/setting/modal";
import SettingTheme from "@/components/setting/theme";
import { useChatStore } from "@/store/chat";
import classnames from "classnames";

export default function Sider() {
    const activePromptKey = useChatStore((state) => state.activePromptKey);
    const setPromptKey = useChatStore((state) => state.setPromptKey);

    return (
        <div className="sider">
            <div className="sider-top">
                <div className="logo-wrapper">
                    <Logo />
                </div>
                <div className="main-menu">
                    <div
                        className={classnames("main-menu-item", {
                            active: activePromptKey === "chat",
                        })}
                        onClick={() => {
                            setPromptKey("chat");
                        }}
                    >
                        <ChatBubbleOvalLeftIcon className="icon" />
                        <div className="text">Chat</div>
                    </div>
                    <div
                        className={classnames("main-menu-item", {
                            active: activePromptKey === "translate",
                        })}
                        onClick={() => {
                            setPromptKey("translate");
                        }}
                    >
                        <LanguageIcon className="icon" />
                        <div className="text">Translate</div>
                    </div>
                    <div className="main-menu-item">
                        <MagnifyingGlassCircleIcon className="icon" />
                        <div className="text">Search</div>
                    </div>
                </div>
            </div>
            <div className="sub-menu">
                <SettingModal />
                <SettingTheme />
            </div>
        </div>
    );
}
