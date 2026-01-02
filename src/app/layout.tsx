import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/client";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DaoTube - YouTube Clone",
  description:
    "DaoTube is a YouTube clone created by Daniel Dao following Code with Antonio's tutorial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.variable} ${inter.className} antialiased`}>
            {children}
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
