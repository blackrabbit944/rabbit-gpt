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
import { getTheme, setTheme } from "@/helper/local";

export default function ThemeSetting() {
    const theme = getTheme();

    const [selectedTheme, setSelectedTheme] = React.useState(theme);
    const [selectedThemeName, setSelectedThemeName] = React.useState("Default");

    const handleChangeTheme = (value: string) => {
        setSelectedTheme(value);
        setTheme(value);
    };
    const [open, setOpen] = React.useState<boolean>(false);

    const toggleOpen = useCallback(() => {
        console.log("toggleOpen", open);
        setOpen(true);
    }, [open]);

    useEffect(() => {
        let themeMap: {
            [key: string]: string;
        } = {
            default: "Default",
            dark: "Dark",
            blue: "BlueBottleCoffee",
        };
        if (themeMap[selectedTheme]) {
            setSelectedThemeName(themeMap[selectedTheme]);
        } else {
            setSelectedThemeName("Default");
        }
    }, [selectedTheme]);

    return (
        <div className="block-theme-select">
            <Select
                onValueChange={handleChangeTheme}
                value={selectedTheme}
                onOpenChange={(v) => {
                    console.log("检查到open变更", v);
                    setOpen(v);
                }}
            >
                <SelectTrigger>
                    <div className="theme-select-trigger" onClick={toggleOpen}>
                        <SparklesIcon className="icon" />
                        <div className="text">{selectedThemeName}</div>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
