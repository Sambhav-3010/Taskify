import type React from "react";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { ApolloProviderWrapper } from "@/providers/ApolloProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Event Management System",
  description:
    "Modern event management with AI-powered creation and Firebase integration",
  generator: "v0.app",
};

// Google font
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-mono",
});

// Geist fonts (just use the imported objects)
const geistSans = GeistSans;
const geistMono = GeistMono;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${robotoMono.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="pt-[var(--navbar-height)]">
        <ApolloProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <Navbar />
              {children}
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </ThemeProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
