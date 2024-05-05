import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function Logo() {
    return (
        <div className="logo flex justify-start items-center">
            <div className="text-green-500 mr-2">
                <ChatBubbleLeftRightIcon className="h-8 w-8" />
            </div>
            JianDa
        </div>
    );
}
