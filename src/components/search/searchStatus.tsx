import classNames from "classnames";
import React from "react";
import {
    MagnifyingGlassCircleIcon,
    EllipsisHorizontalCircleIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    ArrowRightIcon,
    BookOpenIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type PageStatus = "waiting" | "finished" | "waitingGpt" | "finishedGpt";

interface SearchStatusProps {
    status: PageStatus;
    finisheContentCount: number;
    maxContentFinishedCount: number;
}

const SearchStatus: React.FC<SearchStatusProps> = ({
    status,
    finisheContentCount,
    maxContentFinishedCount,
}) => {
    ///根据页面展示一个进度条
    let step = 1;
    switch (status) {
        case "waiting":
            step = 1;
            break;
        case "finished":
            step = 2;
            break;
        case "waitingGpt":
            step = 3;
            break;
        case "finishedGpt":
            step = 4;
            break;
    }

    return (
        <div className="block-steps">
            <div
                className={classNames(
                    "step-one",
                    { active: step == 1 },
                    {
                        done: step > 1,
                    }
                )}
            >
                <div className="icon-w">
                    {step > 1 ? (
                        <CheckCircleIcon className="icon" />
                    ) : (
                        <MagnifyingGlassCircleIcon className="icon" />
                    )}
                </div>
                <div className="step-title">search google</div>
            </div>
            <div className="arrow">
                <ArrowRightIcon className="arrow-icon" />
            </div>
            <div
                className={classNames(
                    "step-one",
                    { active: step == 2 },
                    {
                        done: step > 2,
                    }
                )}
            >
                <div className="icon-w">
                    {step > 2 ? (
                        <CheckCircleIcon className="icon" />
                    ) : (
                        <BookOpenIcon className="icon" />
                    )}
                </div>
                <div className="step-title">read content</div>
                <p>
                    {finisheContentCount} / {maxContentFinishedCount}
                </p>
            </div>
            <div className="arrow">
                <ArrowRightIcon className="arrow-icon" />
            </div>
            <div
                className={classNames(
                    "step-one",
                    { active: step == 3 },
                    {
                        done: step > 3,
                    }
                )}
            >
                <div className="icon-w">
                    {step > 3 ? (
                        <CheckCircleIcon className="icon" />
                    ) : (
                        <ChatBubbleOvalLeftEllipsisIcon className="icon" />
                    )}
                </div>
                <div className="step-title">gpt summarize</div>
            </div>
        </div>
    );
};

export default SearchStatus;
