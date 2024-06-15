import type { Metadata } from "next";
import "./../styles/globals.css";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";
import { Roboto_Condensed } from "next/font/google";

const roboto_condensed = Roboto_Condensed({
    subsets: ["latin"],
    variable: "--font-roboto-condensed",
});

const NonSSRWrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const ComponentWithNoSSR = dynamic(() => Promise.resolve(NonSSRWrapper), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export const metadata: Metadata = {
    title: "RabbitGPT - A beautiful GPT Chat Frontend",
    description: "rabbitgpt",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="theme-default">
            <body className={roboto_condensed.variable}>
                <ComponentWithNoSSR>{children}</ComponentWithNoSSR>
                <Toaster />
            </body>
        </html>
    );
}
