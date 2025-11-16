import Image from "next/image";
import Button from "../button/button";
import "./one-column.scss";

interface BackgroundImage {
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

interface OneColumnProps {
    title: string;
    description: string;
    backgroundImage?: BackgroundImage | null;
    cta?: CTAButton[];
}

export default function OneColumn({
    title,
    description,
    backgroundImage,
    cta = [],
}: OneColumnProps) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || process.env.NEXT_PUBLIC_URL || "http://localhost:1337";
    const imageUrl = backgroundImage?.url ? `${baseUrl}${backgroundImage.url}` : "";
    const imageAlt = backgroundImage?.alternativeText || title;

    return (
        <section className="one-column">
            {backgroundImage && imageUrl && (
                <div className="one-column-background">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="one-column-background-image"
                        sizes="100vw"
                        style={{ objectFit: "cover" }}
                        unoptimized={true}
                    />
                    <div className="one-column-overlay" />
                </div>
            )}
            <div className="one-column-container">
                <div className="one-column-content">
                    <h2 className="one-column-title mt-title">{title}</h2>
                    <p className="one-column-description mt-content">{description}</p>
                    {cta && cta.length > 0 && (
                        <div className="one-column-cta">
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

