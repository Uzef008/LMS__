import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatAssistant from "@/components/ai/ChatAssistant";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "LMS.CORE | Elite Learning Experience",
  description: "A premium, minimalist LMS for advanced learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
        <ChatAssistant />
      </body>
    </html>
  );
}
