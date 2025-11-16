import Image from "next/image";
import Link from "next/link";
import "./header.scss";

export default function Header({ logoUrl, logoAlt, logoLocation, navItems }: { logoUrl: string, logoAlt: string, logoLocation: "left" | "center" | "right", navItems: any[] }) {
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
            </div>
        </header>
    );
}

