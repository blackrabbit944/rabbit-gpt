import https from "https";

interface Image {
    imageUrl: string;
    title: string;
    imageWidth: number;
    imageHeight: number;
}

export interface OrganicOneType {
    title: string;
    link: string;
    snippet: string;
    date?: string;
    position: number;
}

interface SearchResult {
    searchParameters?: {
        q: string;
        hl: string;
        type: string;
        engine: string;
    };
    answerBox?: {
        snippet: string;
        snippetHighlighted: string[];
        title: string;
        link: string;
        date: string;
    };
    organic?: OrganicOneType[];
    relatedSearches?: {
        query: string;
    }[];
}

class Serper {
    private my_api_key: string;

    constructor() {
        // 在这里设置您的 SERPER_KEY
        this.my_api_key = process.env.NEXT_PUBLIC_SERPER_KEY!;
    }

    fakeSearch(query: string, num: number = 10): Promise<SearchResult> {
        let result = {
            searchParameters: {
                q: "蛇为什么会蜕皮",
                hl: "zh-cn",
                type: "search",
                engine: "google",
            },
            answerBox: {
                snippet:
                    "蛇蜕皮不仅是为了满足自身生长的需要，还有其他的好处。 例如，蛇蜕皮可以去除身上的寄生虫和细菌，保持皮肤的清洁和健康，还可以修复身上的伤口和疤痕，恢复皮肤的完整和美观。 因此，蛇蜕皮是一种非常重要的生理现象。",
                snippetHighlighted: ["为了满足自身生长的需要，还有其他的好处"],
                title: "蛇为什么要经常蜕皮？为什么有人说遇到蛇正在脱皮要倒霉？ - 澎湃新闻",
                link: "https://www.thepaper.cn/newsDetail_forward_25396259",
                date: "2023年11月23日",
            },
            organic: [
                {
                    title: "蛇为什么要经常蜕皮？为什么有人说遇到蛇正在脱皮要倒霉？ - 搜狐",
                    link: "https://www.sohu.com/a/738449408_121735369",
                    snippet:
                        "首先，蛇的眼睛会变得模糊，这是因为蛇的眼睛上也有一层透明的角质层，它也要随着蛇的皮一起脱落。这时，蛇的视力会下降，它们会变得更加敏感和警惕，寻找 ...",
                    date: "2023年11月23日",
                    position: 1,
                },
                {
                    title: "为什么蛇要蜕皮？ - 知乎",
                    link: "https://www.zhihu.com/question/540262621",
                    snippet:
                        "不仅如此，蛇类没有腺体，无法排汗，导致皮肤缺水、干燥，形成角质层，最终成为死皮，所以当蛇长到一定程度后，就会自动脱皮长出皮肤来，这是它们的生长 ...",
                    date: "2022年6月28日",
                    sitelinks: [
                        {
                            title: "为什么蛇会蜕皮？ - 廉颇的回答",
                            link: "https://www.zhihu.com/question/542500336/answer/2580963451",
                        },
                        {
                            title: "蛇为什么要蜕皮？",
                            link: "https://www.zhihu.com/question/652870535",
                        },
                        {
                            title: "蛇为什么会脱皮？一年要脱几次？",
                            link: "https://www.zhihu.com/question/540487882",
                        },
                        {
                            title: "在农村，常见有蛇蜕皮后留下来的蛇皮，有什么利用价值吗？",
                            link: "https://www.zhihu.com/question/625025310/answer/3425215957",
                        },
                    ],
                    position: 2,
                },
                {
                    title: "蛇蜕皮的知识看这里！（新手老手都应该了解） - 搜狐",
                    link: "https://www.sohu.com/a/163948276_208817",
                    snippet:
                        "伴随着蛇的生长，蛇会出现蜕皮现象。蛇每蜕一次皮，就意味着长大一次，这是因为原来的皮冉也包裹不了正存成长的蛇体。蛇蜕皮与生长成正比。一旦蜕不下 ...",
                    date: "2017年8月11日",
                    position: 3,
                },
                {
                    title: "养蛇多年的老师傅告诉我：看到蛇脱皮必须马上脱掉上衣！ - 网易",
                    link: "https://www.163.com/dy/article/HSDRLRDR0553SFSY.html",
                    snippet:
                        "蛇类的蜕皮是每隔一段时间便会重复进行的，而蛇类毕生都会一直进行蜕皮。在要蜕皮之前，蛇类会停止饮食并躲在某个安全的地方。蜕皮时蛇类的表皮会变得暗哑 ...",
                    date: "2023年1月31日",
                    position: 4,
                },
                {
                    title: "蛇为何会脱皮？在野外看到蛇脱皮要快速脱掉外套，有道理吗？ - 网易",
                    link: "https://www.163.com/dy/article/EHFSNBUE0526LCL1.html",
                    snippet:
                        "蛇脱皮是一个痛苦的过程，蛇皮就是蛇的衣服。在民间认为看到蛇脱皮不会有好事情发生，需要马上脱衣服才能化解。其实就是因为蛇脱皮是很私密的过程，它们会 ...",
                    date: "2019年6月12日",
                    position: 5,
                },
                {
                    title: "蛇为什么要经常蜕皮？为什么有人说遇到蛇正在脱皮要倒霉？ - 腾讯新闻",
                    link: "https://new.qq.com/rain/a/20231123A00E3J00",
                    snippet:
                        "首先，蛇的眼睛会变得模糊，这是因为蛇的眼睛上也有一层透明的角质层，它也要随着蛇的皮一起脱落。这时，蛇的视力会下降，它们会变得更加敏感和警惕，寻找 ...",
                    date: "2023年11月23日",
                    position: 6,
                },
                {
                    title: "蛇为什么会脱皮，蛇能活多久？ - 喜马拉雅手机版",
                    link: "https://m.ximalaya.com/ask/q6505400",
                    snippet:
                        "蛇会脱皮最主要的原因，把身上的这层皮脱掉之后，它会继续生存下去，而且会越长越粗重，如果蛇不脱皮的话，肯定就会死掉，这就是蛇为什么会活上千年上 ...",
                    date: "2023年1月11日",
                    position: 7,
                },
                {
                    title: "蛇蜕皮的原因与过程- 豆包- AI 智能助手",
                    link: "https://www.doubao.com/traffic/ask/79986",
                    snippet:
                        "蛇蜕皮的过程中可能会经历一定程度的不适，但不能简单地说它们会感到痛苦。 首先，蜕皮是蛇生长过程中的自然阶段，它们具备适应这一过程的生理机制。在蜕皮时，蛇的身体会 ...",
                    position: 8,
                },
                {
                    title: "老人说见到正在蜕皮的蛇不妙，有何科学依据？ - 新浪",
                    link: "https://k.sina.cn/article_6926071998_19cd378be00100zo0a.html?from=science",
                    snippet:
                        "关于蛇蜕皮，在农村地区有一个说法，那就是：遇到蛇蜕皮的人要跟着它一起把衣服脱掉，不然就会倒霉。当然，这个说法是没有任何的科学依据的， ...",
                    date: "2022年3月13日",
                    position: 9,
                },
            ],
            relatedSearches: [
                {
                    query: "蛇蜕皮时间",
                },
                {
                    query: "蛇蜕皮英文",
                },
                {
                    query: "蛇多久蜕皮一次",
                },
                {
                    query: "蛇脱皮万字",
                },
            ],
        };

        return new Promise((resolve, reject) => {
            resolve(result);
        });
    }

    search(query: string, num: number = 10): Promise<SearchResult> {
        const options: https.RequestOptions = {
            hostname: "google.serper.dev",
            path: "/search",
            method: "POST",
            headers: {
                "X-API-KEY": this.my_api_key,
                "Content-Type": "application/json",
            },
        };

        const payload = JSON.stringify({
            q: query,
            hl: "zh-cn",
        });

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    try {
                        const json_data: SearchResult = JSON.parse(data);
                        resolve(json_data);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on("error", (error) => {
                console.error("serper search error", error);
                reject(error);
            });

            req.write(payload);
            req.end();
        });
    }

    searchImage(query: string, num: number = 10): Promise<Image[]> {
        const options: https.RequestOptions = {
            hostname: "google.serper.dev",
            path: "/images",
            method: "POST",
            headers: {
                "X-API-KEY": this.my_api_key,
                "Content-Type": "application/json",
            },
        };

        const payload = JSON.stringify({
            q: query,
        });

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    try {
                        const json_data: SearchResult = JSON.parse(data);
                        const formated_images: Image[] = json_data.images.map((image) => ({
                            url: image.imageUrl,
                            title: image.title,
                            width: image.imageWidth,
                            height: image.imageHeight,
                        }));
                        resolve(formated_images);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on("error", (error) => {
                console.error("serper search error", error);
                reject(error);
            });

            req.write(payload);
            req.end();
        });
    }
}

export default Serper;
