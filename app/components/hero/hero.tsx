import Image from "next/image";
import Link from "next/link";
import "./hero.scss";

interface HeroImage {
    id: number;
    url: string;
    alternativeText?: string | null;
    formats?: {
        thumbnail?: { url: string };
        small?: { url: string };
        medium?: { url: string };
        large?: { url: string };
    };
    width?: number;
    height?: number;
}

interface CTAButton {
    id: number;
    label: string;
    url: string;
    target?: string;
    type?: "primary" | "secondary";
}

interface HeroProps {
    title: string;
    description: string;
    heroType: "Image" | "Video";
    image: HeroImage[];
    cta?: CTAButton[];
}

export default function Hero({
    title,
    description,
    heroType,
    image,
    cta = [],
}: HeroProps) {
    const backgroundImage = image?.[0];
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || process.env.NEXT_PUBLIC_URL || "http://localhost:1337";
    const imageUrl = backgroundImage?.url ? `${baseUrl}${backgroundImage.url}` : "";
    const imageAlt = backgroundImage?.alternativeText || title;

    return (
        <section className="hero">
            {backgroundImage && (
                <div className="hero-background">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        priority
                        className="hero-background-image"
                        sizes="100vw"
                        style={{ objectFit: "cover" }}
                        unoptimized={true}
                    />
                    <div className="hero-overlay" />
                </div>
            )}
            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">{title}</h1>
                    <p className="hero-description">{description}</p>
                    {cta && cta.length > 0 && (
                        <div className="hero-cta">
                            {cta.map((button) => {
                                const isExternal = button.target === "_blank";
                                const buttonClass = `hero-button hero-button--${button.type || "primary"}`;

                                if (isExternal || button.url.startsWith("http")) {
                                    return (
                                        <a
                                            key={button.id}
                                            href={button.url}
                                            target={button.target}
                                            rel={button.target === "_blank" ? "noopener noreferrer" : undefined}
                                            className={buttonClass}
                                        >
                                            {button.label}
                                        </a>
                                    );
                                }

                                return (
                                    <Link key={button.id} href={button.url} className={buttonClass}>
                                        {button.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

