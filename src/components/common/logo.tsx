import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function Logo() {
    return (
        <div className="logo flex justify-start items-center">
            <div className="text-logo mr-2">
                <ChatBubbleLeftRightIcon className="h-8 w-8" />
            </div>
        </div>
    );
}
