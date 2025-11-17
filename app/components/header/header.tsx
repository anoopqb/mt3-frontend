import Image from "next/image";
import Link from "next/link";
import "./header.scss";
import Button from "../button/button";

interface CTA {
    id: number;
    label: string;
    url: string;
    target?: string;
    type?: "primary" | "secondary";
}

export default function Header({ logoUrl, logoAlt, logoLocation, navItems, cta }: { logoUrl: string, logoAlt: string, logoLocation: "left" | "center" | "right", navItems: any[], cta?: CTA }) {
    const getLogoPositionClass = () => {
        switch (logoLocation) {
            case "left":
                return "logo-left";
            case "center":
                return "logo-center";
            default:
                return "logo-left";
        }
    };

    return (
        <header className="header">
            <div className={`header-container ${getLogoPositionClass()}`}>
                <div className="header-logo">
                    <Link href="/">
                        <Image src={logoUrl} alt={logoAlt} width={100} height={30} priority />
                    </Link>
                </div>
                <div className="header-nav">
                    <ul className="header-nav-list">
                        {navItems.map((item: any) => (
                            <li key={item.id} className="header-nav-item">
                                <Link href={`/${item.MenuItem.toLowerCase().replace(/\s+/g, "-")}`}>{item.MenuItem}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {cta && (
                    <div className="header-cta">
                        <Button type={cta.type} href={cta.url} target={cta.target} size="small">
                            {cta.label}
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}

