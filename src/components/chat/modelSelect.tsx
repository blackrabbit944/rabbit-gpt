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
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ChatGPT 3.5 turbo" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="gpt-3.5-turbo">ChatGPT 3.5 turbo</SelectItem>
                <SelectItem value="gpt-4-turbo">ChatGPT 4.0 turbo</SelectItem>
            </SelectContent>
        </Select>
    );
}
