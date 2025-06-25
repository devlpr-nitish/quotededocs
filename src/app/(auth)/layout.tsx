import type { Metadata } from "next";
import "@/app/globals.css";


export const metadata: Metadata = {
    title: "Quotedocs - Authentication",
    description: "Authentication",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-[18rem] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {children}
            </div>
        </div>
    );
}
