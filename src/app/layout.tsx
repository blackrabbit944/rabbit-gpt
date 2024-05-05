import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../styles/globals.css";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";

const NonSSRWrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const ComponentWithNoSSR = dynamic(() => Promise.resolve(NonSSRWrapper), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Jianda - A beautiful AI Chat Website",
    description: "jianda.com",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="theme-default">
            <body className={inter.className}>
                <ComponentWithNoSSR>{children}</ComponentWithNoSSR>
                <Toaster />
            </body>
        </html>
    );
}
