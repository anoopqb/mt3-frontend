import Image from "next/image";
import Button from "../button/button";
import "./two-column.scss";

interface TwoColumnImage {
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

interface TwoColumnProps {
    title: string;
    description: string;
    image?: TwoColumnImage[];
    reverse_column?: boolean | null;
    cta?: CTAButton[];
}

export default function TwoColumn({
    title,
    description,
    image,
    reverse_column = false,
    cta = [],
}: TwoColumnProps) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || process.env.NEXT_PUBLIC_URL || "http://localhost:1337";
    const columnImage = image?.[0];
    const imageUrl = columnImage?.url ? `${baseUrl}${columnImage.url}` : "";
    const imageAlt = columnImage?.alternativeText || title;
    const isReversed = reverse_column === true;

    return (
        <section className={`two-column ${isReversed ? "two-column--reversed" : ""}`}>
            <div className="two-column-container">
                <div className="two-column-grid">
                    {columnImage && imageUrl && (
                        <div className="two-column-image-wrapper">
                            <Image
                                src={imageUrl}
                                alt={imageAlt}
                                width={columnImage.width || 640}
                                height={columnImage.height || 480}
                                className="two-column-image"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                unoptimized={true}
                            />
                        </div>
                    )}
                    <div className="two-column-content">
                        <h2 className="two-column-title mt-title">{title}</h2>
                        <p className="two-column-description mt-content">{description}</p>
                        {cta && cta.length > 0 && (
                            <div className="two-column-cta">
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
            </div>
        </section>
    );
}

