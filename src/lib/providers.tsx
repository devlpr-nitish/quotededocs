"use client";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/custom/Navbar";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/custom/Footer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster position="top-center" />
        <Navbar />
        {children}
        <Footer />
      </ThemeProvider>
    </SessionProvider>
  );
}