import exp from "constants";

export interface MessageType {
    content: string;
    timestamp: number;
    from: "user" | "assistant";
    id: string;
    isFinished: boolean;
}

export interface MessageMapType {
    [key: string]: MessageType[];
}

export interface MessageAndKeyType {
    promptKey: string;
    message: MessageType;
}

export interface PreMessageType {
    content: string;
    role: string;
}
