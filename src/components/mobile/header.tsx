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
                <div className="flex justify-between items-center w-full  z-30 h-16 ">
                    <SheetTrigger>
                        <button className="group h-12 w-12 rounded-lg">
                            <div className="grid justify-items-center gap-1">
                                <span className="h-0.5 w-5 rounded-full bg-white transition group-hover:rotate-45 group-hover:translate-y-1.5"></span>
                                <span className="h-0.5 w-5 rounded-full bg-white group-hover:scale-x-0 transition"></span>
                                <span className="h-0.5 w-5 rounded-full bg-white group-hover:-rotate-45 group-hover:-translate-y-1.5"></span>
                            </div>
                        </button>
                    </SheetTrigger>
                    <div></div>
                    <div></div>
                </div>
                <SheetContent className="p-0 border-black/40">
                    <Sider />
                </SheetContent>
            </Sheet>
        </div>
    );
}
