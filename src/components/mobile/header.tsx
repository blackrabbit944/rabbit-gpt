import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Sider from "@/components/layout/sider";
import Logo from "@/components/common/logo";

export default function MobileHeader() {
    return (
        <div className="block sm:hidden">
            <Sheet>
                <div className="flex justify-between items-center fixed top-0 w-full bg-background z-30 h-14 shadow-md">
                    <SheetTrigger>
                        <button className="group h-12 w-12 rounded-lg">
                            <div className="grid justify-items-center gap-1">
                                <span className="h-0.5 w-5 rounded-full bg-black transition group-hover:rotate-45 group-hover:translate-y-1.5"></span>
                                <span className="h-0.5 w-5 rounded-full bg-black group-hover:scale-x-0 transition"></span>
                                <span className="h-0.5 w-5 rounded-full bg-black group-hover:-rotate-45 group-hover:-translate-y-1.5"></span>
                            </div>
                        </button>
                    </SheetTrigger>
                    <div></div>
                    <div></div>
                </div>
                <SheetContent className="p-0">
                    <Sider />
                </SheetContent>
            </Sheet>
        </div>
    );
}
