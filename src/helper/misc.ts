export const getRandomId = (): string => {
    return Math.random().toString(36).substring(7);
};

export const getUnixtimestamp = (): number => {
    return new Date().getTime();
};

export const getNowDate = (): string => {
    return new Date().toLocaleDateString();
};

export const getApiUrl = (path: string): string => {
    let api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (path.startsWith("/")) {
        return api_base_url + path;
    } else {
        return api_base_url + "/" + path;
    }
};
