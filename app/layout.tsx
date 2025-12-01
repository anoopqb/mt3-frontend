import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header/header";
import { fetchApiData } from "@/lib/strapi";
import Footer from "./components/footer/footer";
import SpecialsPopup from "./components/specials-popup/specials-popup";
import pathname from "next/navigation";



interface CTA {
  id: number;
  label: string;
  url: string;
  target?: string;
  type?: "primary" | "secondary";
}

interface GlobalApiResponse {
  data: {
    title: string;
    siteName: string;
    logo: {
      url: string;
    };
    [key: string]: unknown;
    Specials: {
      title: string;
      description: string;
      cta: CTA[];
    };
    scheduleTour: CTA;
  }
}

interface HeaderApiResponse {
  data: {
    logoLocation: "left" | "center";
    NavMenu: any[];
  }
}

interface FooterApiResponse {
  data: {
    logoUrl: string;
    AddressLane1: string;
    AddressLane2: string;
    ZipCode: string;
    PhoneNumber: string;
    OfficeHoursTitle: string;
    OfficeHours: any[];
    copyright: string;
  }
}




const globalData = await fetchApiData<GlobalApiResponse>("global?pLevel=3");
const headerData = await fetchApiData<HeaderApiResponse>("header?pLevel=3");
const footerData = await fetchApiData<FooterApiResponse>("footer?pLevel=3");
const global = globalData.data;
const header = headerData.data;
const footer = footerData.data;

export const metadata: Metadata = {
  title: (globalData.data.siteName as string) || globalData.data.title,
  description: "MT3 Website",
};

const siteId = process.env.NEXT_PUBLIC_CSS || 'sitea';
const cssFile = `/styles/${siteId}.css`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={`${cssFile}`} />
      </head>
      <body
        className={`antialiased`}
      >
        <Header logoUrl={`${process.env.NEXT_PUBLIC_URL}${global.logo.url}`} logoAlt="Logo" logoLocation={header.logoLocation} navItems={header.NavMenu} cta={global.scheduleTour} />


        {/* <SpecialsPopup title={global.Specials.title} description={global.Specials.description} cta={global.Specials.cta} /> */}


        {children}

        <Footer
          logoUrl={`${process.env.NEXT_PUBLIC_URL}${global.logo.url}`}
          logoAlt="Logo"
          addressLane1={footer.AddressLane1}
          addressLane2={footer.AddressLane2}
          zipCode={footer.ZipCode}
          phoneNumber={footer.PhoneNumber}
          officeHoursTitle={footer.OfficeHoursTitle}
          officeHours={footer.OfficeHours}
          copyright={footer.copyright}
        />
      </body>
    </html >
  );
}
