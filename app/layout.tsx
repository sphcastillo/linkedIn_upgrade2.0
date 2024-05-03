import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkedIn 2.0 Upgrade",
  description: "Full Stack LinkedIn Clone with Next.js, Tailwind CSS, Miscrosoft Azure, MongoDB, and Clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className='min-h-screen flex flex-col'>
          <Toaster position="bottom-left"/>
          <header className="border-b sticky top-0 z-50 bg-white">
            <Header />
          </header>
          <div  className="bg-[#F4F2ED] flex-1 w-full">
            <main className="max-w-6xl mx-auto">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
