export const getRandomId = (): string => {
    return Math.random().toString(36).substring(7);
};

export const getUnixtimestamp = (): number => {
    return new Date().getTime();
};

export const getNowDate = (): string => {
    return new Date().toLocaleDateString();
};
