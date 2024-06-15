import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { getCache, setCache } from "@/helper/local";
export default function ModelSelect() {
    let savdModel = getCache("model") || "gpt-3.5-turbo";

    let [model, setModel] = React.useState(savdModel);
    const saveModel = (value: string) => {
        setCache("model", value);
    };
    return (
        <Select onValueChange={saveModel} defaultValue={model}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="ChatGPT 3.5 turbo" />
            </SelectTrigger>
            <SelectContent>
                <div className="text-sm pb-2 pt-1 px-2 opacity-40">选择使用模型</div>
                <SelectItem value="gpt-3.5-turbo">GPT 3.5</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT 4.0</SelectItem>
                <SelectItem value="gpt-4o">GPT 4o</SelectItem>
            </SelectContent>
        </Select>
    );
}
