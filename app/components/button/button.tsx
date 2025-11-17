import Link from "next/link";
import "./button.scss";

interface ButtonProps {
    children: React.ReactNode;
    type?: "primary" | "secondary";
    size?: "small" | "medium" | "large";
    href?: string;
    onClick?: () => void;
    target?: string;
    disabled?: boolean;
    className?: string;
    variant?: "button" | "link";
}

export default function Button({
    children,
    type = "primary",
    size = "medium",
    href,
    onClick,
    target,
    disabled = false,
    className = "",
    variant = "button",
}: ButtonProps) {
    const baseClass = `button button--${type} button--${size}`;
    const combinedClassName = `${baseClass} ${className}`.trim();

    // If href is provided, render as Link or anchor
    if (href) {
        const isExternal = href.startsWith("http") || target === "_blank";

        if (isExternal) {
            return (
                <a
                    href={href}
                    target={target}
                    rel={target === "_blank" ? "noopener noreferrer" : undefined}
                    className={combinedClassName}
                    aria-disabled={disabled}
                >
                    {children}
                </a>
            );
        }

        return (
            <Link href={href} className={combinedClassName} aria-disabled={disabled}>
                {children}
            </Link>
        );
    }

    // Otherwise render as button element
    return (
        <button
            type={variant === "button" ? "button" : undefined}
            onClick={onClick}
            disabled={disabled}
            className={combinedClassName}
        >
            {children}
        </button>
    );
}

