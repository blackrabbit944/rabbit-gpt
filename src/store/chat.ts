// import slice from "zustand-slice";
import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MessageType, MessageAndKeyType } from "@/types/message";

interface ChatList {
    [key: string]: {
        status: "waiting" | "receiving" | "done" | "error";
        list: MessageType[];
    };
}

export interface State {
    activePromptKey: string;
    chat_list: ChatList;
}

export const initialState: State = {
    activePromptKey: "chat",
    chat_list: {},
};

export interface Actions extends ReturnType<typeof actions> {}

interface initChatListType {
    status: "waiting" | "receiving" | "done" | "error";
    list: MessageType[];
}
const initChatList: initChatListType = {
    status: "waiting",
    list: [],
};

const addMessageIfNotExist = (message_list: MessageType[], payload: MessageType) => {
    console.log("addMessageIfNotExist", message_list, payload);

    const all_message_id = message_list.map((item: any) => item.id);
    if (!all_message_id.includes(payload.id)) {
        message_list.push(payload);
    }
    return message_list;
};

export const reducers = (set: Function, get: Function) => ({
    setPromptKey: (payload: string) => {
        set(
            (state: State) => {
                state.activePromptKey = payload;
            },
            false,
            "setPromptKey"
        );
    },

    addSendMessage: (payload: MessageAndKeyType) => {
        console.log("addSendMessage", payload);
        set(
            (state: State) => {
                const { promptKey, message } = payload;

                const chat_list = state.chat_list;

                if (!chat_list[promptKey]) {
                    chat_list[promptKey] = initChatList;
                }

                //从payload中移除promptKey,然后获得一个新的对象
                chat_list[promptKey]["list"] = addMessageIfNotExist(
                    chat_list[promptKey]["list"],
                    message
                );

                state.chat_list = chat_list;
            },
            false,
            "addSendMessage"
        );
    },
    beforeRecieveMessage: (payload: { promptKey: string }) => {
        set(
            (state: State) => {
                const { promptKey } = payload;

                const chat_list = state.chat_list;

                if (!chat_list[promptKey]) {
                    chat_list[promptKey] = initChatList;
                }

                chat_list[promptKey]["status"] = "receiving";

                state.chat_list = chat_list;
            },
            false,
            "beforeRecieveMessage"
        );
    },
    recieveMessage: (payload: MessageAndKeyType) => {
        set(
            (state: State) => {
                const { promptKey, message } = payload;

                const chat_list = state.chat_list;

                ///如果state里面的chat_list里面没有这个promptKey,就创建一个
                if (!chat_list[promptKey]) {
                    chat_list[promptKey] = initChatList;
                }

                ///如果state里面的chat_list里面有这个promptKey,就添加一个message
                chat_list[promptKey]["status"] = "receiving";

                ///把所有new_state['chat_list'][promptKey]下的消息的id拿到
                const index = chat_list[promptKey]["list"].findIndex(
                    (item: any) => item.id === message.id
                );
                ///如果没有这个index
                if (index === -1) {
                    console.log("没有这个id", message.id);
                    chat_list[promptKey]["list"].push(message);
                } else {
                    chat_list[promptKey]["list"][index] = message;
                }

                state.chat_list = chat_list;
            },
            false,
            {
                type: "recieveMessage",
                payload: payload,
            }
        );
    },
    recieveMessageSuccess: (payload: MessageAndKeyType) => {
        set(
            (state: State) => {
                const { promptKey, message } = payload;

                const chat_list = state.chat_list;
                chat_list[promptKey]["status"] = "done";

                const index = chat_list[promptKey]["list"].findIndex(
                    (item: any) => item.id === message.id
                );

                ///如果没有这个index
                if (index === -1) {
                    chat_list[promptKey]["list"].push(message);
                } else {
                    chat_list[promptKey]["list"][index] = message;
                }

                state.chat_list = chat_list;
            },
            false,
            {
                type: "recieveMessageSuccess",
                payload: payload,
            }
        );
    },
    recieveMessageError: (payload: { promptKey: string }) => {
        set(
            (state: State) => {
                const { promptKey } = payload;

                const chat_list = state.chat_list;
                chat_list[promptKey]["status"] = "error";

                state.chat_list = chat_list;
            },
            false,
            "recieveMessageError"
        );
    },

    clearMessageList: (payload: string) => {
        set((state: State) => {
            const chat_list = state.chat_list;
            chat_list[payload]["list"] = [];

            state.chat_list = chat_list;
        });
    },
});

export const actions = (set: Function, get: Function) => ({
    ...initialState,
    ...reducers(set, get),
});

///定义一个type属于actions

export const usePersistedStore = create<State & Actions>()(
    devtools(
        persist(
            immer((set, get) => actions(set, get)),
            {
                name: "chat-store",
            }
        )
    )
);

export const useChatStore = usePersistedStore;
