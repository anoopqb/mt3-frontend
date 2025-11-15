import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { fetchApiData } from "@/lib/strapi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MT3 Website",
  description: "MT3 Website",
};

interface GlobalApiResponse {
  data: {
    logo: {
      url: string;
    };
    [key: string]: unknown;
  }
}

interface HeaderApiResponse {
  data: {
    logoLocation: "left" | "center";
    NavMenu: any[];
  }
}

const globalData = await fetchApiData<GlobalApiResponse>("global?pLevel=3");
const headerData = await fetchApiData<HeaderApiResponse>("header?pLevel=3");
const global = globalData.data;
const header = headerData.data;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header logoUrl={`${process.env.NEXT_PUBLIC_URL}${global.logo.url}`} logoAlt="Logo" logoLocation={header.logoLocation} navItems={header.NavMenu} />
        {children}
      </body>
    </html>
  );
}
