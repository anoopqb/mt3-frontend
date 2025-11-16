import Image from "next/image";
import Button from "../button/button";
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

interface HeroVideo {
    id: number;
    url: string;
    alternativeText?: string | null;
    mime?: string;
    ext?: string;
    size?: number;
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
    HeroType: "Image" | "Video";
    image?: HeroImage[];
    Video?: HeroVideo | null;
    cta?: CTAButton[];
}

export default function Hero({
    title,
    description,
    HeroType,
    image,
    Video,
    cta = [],
}: HeroProps) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || process.env.NEXT_PUBLIC_URL || "http://localhost:1337";
    const backgroundImage = image?.[0];
    const imageUrl = backgroundImage?.url ? `${baseUrl}${backgroundImage.url}` : "";
    const imageAlt = backgroundImage?.alternativeText || title;
    const videoUrl = Video?.url ? `${baseUrl}${Video.url}` : "";

    console.log(HeroType);

    return (
        <section className="hero">
            {HeroType === "Video" && Video && videoUrl && (
                <div className="hero-background">
                    <video
                        className="hero-background-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src={videoUrl} type={Video.mime || "video/mp4"} />
                    </video>
                    <div className="hero-overlay" />
                </div>
            )}
            {HeroType === "Image" && backgroundImage && imageUrl && (
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
                    <h1 className="hero-title mt-title">{title}</h1>
                    <p className="hero-description">{description}</p>
                    {cta && cta.length > 0 && (
                        <div className="hero-cta">
                            {cta.map((button) => (
                                <Button
                                    key={button.id}
                                    type={button.type || "primary"}
                                    href={button.url}
                                    target={button.target}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

