export const setThemeInCss = (theme: string): void => {
    document.documentElement.className = "theme-" + theme;
};

export const setTheme = (value: string) => {
    setCache("theme", value); //保存到本地
    setThemeInCss(value); //设置到css
};

export const isSystemDarkMode = () => {
    if (window && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return true;
    } else {
        return false;
    }
};

export const getTheme = () => {
    if (typeof window !== "undefined" && !checkLocalStorageValue("theme")) {
        if (isSystemDarkMode()) {
            return "dark";
        } else {
            return "default";
        }
    } else {
        let theme = getCache("theme");
        if (!theme) {
            return "default";
        } else {
            return theme;
        }
    }
};

export const isDarkTheme = (theme: string): boolean => {
    let darkThemeList = ["dark"];
    if (darkThemeList.includes(theme)) {
        return true;
    } else {
        return false;
    }
};

/*检查本地是否存储过皮肤数据*/
const checkLocalStorageValue = (key: string): boolean => {
    if (typeof window !== "undefined" && window.localStorage) {
        if (key in window.localStorage) {
            return true;
        } else {
            return false;
        }
    } else {
        console.log("localStorage不存在");
        return false;
    }
};

const checkLocalStorage = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        return true;
    } else {
        console.log("localStorage不存在");
        return false;
    }
};

export const setCache = (name: string, value: string) => {
    if (checkLocalStorage()) {
        window.localStorage.setItem(name, value);
        return true;
    } else {
        return false;
    }
};

export const getCache = (name: string, default_value = null) => {
    if (checkLocalStorage()) {
        if (window.localStorage.getItem(name) === null) {
            return default_value;
        } else {
            return window.localStorage.getItem(name);
        }
    }
};
export const clearCache = (name: string) => {
    if (checkLocalStorage()) {
        window.localStorage.removeItem(name);
        return true;
    } else {
        return false;
    }
};
