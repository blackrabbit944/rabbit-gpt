// import slice from "zustand-slice";
import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MessageType, MessageAndSearchKeyType } from "@/types/message";

interface SearchList {
    [key: string]: {
        status: "waiting" | "receiving" | "done" | "error";
        list: MessageType[];
    };
}

export interface State {
    searchList: SearchList;
    searchHistory: string[];
}

export const initialState: State = {
    searchList: {},
    searchHistory: [],
};

export interface Actions extends ReturnType<typeof actions> {}

interface initSearchListType {
    status: "waiting" | "receiving" | "done" | "error";
    list: MessageType[];
}
const initSearchList: initSearchListType = {
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
    addSearchHistory: (payload: string) => {
        set(
            (state: State) => {
                ///最多存15条
                if (state.searchHistory.length >= 15) {
                    state.searchHistory = state.searchHistory.slice(1);
                }
                state.searchHistory = [...state.searchHistory, payload];
            },
            false,
            "addSearchHistory"
        );
    },
    clearSearchHistory: () => {
        set(
            (state: State) => {
                state.searchHistory = [];
            },
            false,
            "clearSearchHistory"
        );
    },
    removeSearchHistory: (payload: string) => {
        set(
            (state: State) => {
                state.searchHistory = state.searchHistory.filter((item) => item !== payload);
            },
            false,
            "removeSearchHistory"
        );
    },

    addSendMessage: (payload: MessageAndSearchKeyType) => {
        console.log("addSendMessage", payload);
        set(
            (state: State) => {
                const { searchKey, message } = payload;

                const searchlist = state.searchList;

                if (!searchlist[searchKey]) {
                    searchlist[searchKey] = { ...initSearchList };
                }

                //从payload中移除searchKey,然后获得一个新的对象
                searchlist[searchKey]["list"] = addMessageIfNotExist(
                    searchlist[searchKey]["list"],
                    message
                );

                state.searchList = searchlist;
            },
            false,
            "addSendMessage"
        );
    },
    beforeRecieveMessage: (payload: { searchKey: string }) => {
        set(
            (state: State) => {
                const { searchKey } = payload;

                const searchlist = state.searchList;
                if (!searchlist[searchKey]) {
                    searchlist[searchKey] = { ...initSearchList };
                }

                searchlist[searchKey]["status"] = "receiving";

                state.searchList = searchlist;
            },
            false,
            "beforeRecieveMessage"
        );
    },
    recieveMessage: (payload: MessageAndSearchKeyType) => {
        set(
            (state: State) => {
                const { searchKey, message } = payload;

                const searchlist = state.searchList;

                ///如果state里面的searchlist里面没有这个searchKey,就创建一个
                if (!searchlist[searchKey]) {
                    searchlist[searchKey] = initSearchList;
                }

                ///如果state里面的searchlist里面有这个searchKey,就添加一个message
                searchlist[searchKey]["status"] = "receiving";

                ///把所有new_state['searchlist'][searchKey]下的消息的id拿到
                const index = searchlist[searchKey]["list"].findIndex(
                    (item: any) => item.id === message.id
                );
                ///如果没有这个index
                if (index === -1) {
                    console.log("没有这个id", message.id);
                    searchlist[searchKey]["list"].push(message);
                } else {
                    searchlist[searchKey]["list"][index] = message;
                }

                state.searchList = searchlist;
            },
            false,
            {
                type: "recieveMessage",
                payload: payload,
            }
        );
    },
    recieveMessageSuccess: (payload: MessageAndSearchKeyType) => {
        set(
            (state: State) => {
                const { searchKey, message } = payload;

                const searchlist = state.searchList;
                searchlist[searchKey]["status"] = "done";

                const index = searchlist[searchKey]["list"].findIndex(
                    (item: any) => item.id === message.id
                );

                ///如果没有这个index
                if (index === -1) {
                    searchlist[searchKey]["list"].push(message);
                } else {
                    searchlist[searchKey]["list"][index] = message;
                }

                state.searchList = searchlist;
            },
            false,
            {
                type: "recieveMessageSuccess",
                payload: payload,
            }
        );
    },
    recieveMessageError: (payload: { searchKey: string }) => {
        set(
            (state: State) => {
                const { searchKey } = payload;

                const searchlist = state.searchList;
                searchlist[searchKey]["status"] = "error";

                state.searchList = searchlist;
            },
            false,
            "recieveMessageError"
        );
    },

    clearMessageList: (payload: string) => {
        set((state: State) => {
            const searchlist = state.searchList;
            searchlist[payload]["list"] = [];

            state.searchList = searchlist;
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
                name: "search-store",
            }
        )
    )
);

export const useSearchStore = usePersistedStore;
