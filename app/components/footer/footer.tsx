import Image from "next/image";
import Link from "next/link";
import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";
import "./footer.scss";

interface FooterProps {
    logoUrl: string;
    logoAlt: string;
    addressLane1: string;
    addressLane2: string;
    zipCode: string;
    phoneNumber: string;
    officeHoursTitle: string;
    officeHours: any[];
    copyright: string;
}



export default function Footer({
    logoUrl,
    logoAlt,
    addressLane1,
    addressLane2,
    zipCode,
    phoneNumber,
    officeHoursTitle,
    officeHours,
    copyright = `© ${new Date().getFullYear()} All rights reserved.`,
}: FooterProps) {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <div className="footer-logo">
                        <Link href="/">
                            <Image src={logoUrl} alt={logoAlt} width={129} height={43} />
                        </Link>
                    </div>
                    <div className="footer-contact">
                        <div className="footer-address">
                            <p>{addressLane1}</p>
                            <p>
                                {addressLane2}
                                {zipCode}
                            </p>
                        </div>
                        <div className="footer-phone">
                            <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                        </div>
                    </div>
                </div>
                <div className="footer-right">
                    <h3 className="footer-hours-title">{officeHoursTitle}</h3>
                    <div className="footer-hours">
                        <BlocksRenderer content={officeHours} />
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <p>{copyright}</p>
            </div>
        </footer>
    );
}

