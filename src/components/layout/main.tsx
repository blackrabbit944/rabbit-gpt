import Sider from "@/components/layout/sider";
// import MobileHeader from "@/components/mobile/header";
export default function LayoutMain({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="layout-main">
            <div className="layout-left">
                <Sider />
            </div>
            <div className="layout-right">{children}</div>
        </div>
    );
}
