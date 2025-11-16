"use client";

import { useEffect, useState } from "react";
import Button from "../button/button";
import "./specials-popup.scss";

interface cta {
    id: number;
    label: string;
    url: string;
    target?: string;
    type?: "primary" | "secondary";
}

interface SpecialsPopupProps {
    title: string;
    description: string;
    cta?: cta[];
    isOpen?: boolean;
    onClose?: () => void;
    showCloseButton?: boolean;
}

export default function SpecialsPopup({
    title,
    description,
    cta = [],
    isOpen: controlledIsOpen,
    onClose,
    showCloseButton = true,
}: SpecialsPopupProps) {
    const [isOpen, setIsOpen] = useState(controlledIsOpen ?? false);
    const [isMounted, setIsMounted] = useState(false);

    // Handle controlled vs uncontrolled state
    const isPopupOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

    useEffect(() => {
        setIsMounted(true);
        // Auto-open on mount if uncontrolled
        if (controlledIsOpen === undefined) {
            setIsOpen(true);
        }
    }, [controlledIsOpen]);

    const handleClose = () => {
        if (controlledIsOpen === undefined) {
            setIsOpen(false);
        }
        onClose?.();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Prevent body scroll when popup is open
    useEffect(() => {
        if (isPopupOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isPopupOpen]);

    if (!isMounted || !isPopupOpen) {
        return null;
    }

    return (
        <div className="specials-popup-overlay" onClick={handleBackdropClick}>
            <div className="specials-popup" role="dialog" aria-modal="true" aria-labelledby="specials-popup-title">
                {showCloseButton && (
                    <button
                        className="specials-popup-close"
                        onClick={handleClose}
                        aria-label="Close popup"
                    >
                        ×
                    </button>
                )}
                <div className="specials-popup-content">
                    <h2 id="specials-popup-title" className="specials-popup-title mt-title">
                        {title}
                    </h2>
                    <div className="specials-popup-description mt-content">
                        {description.split("\n").map((line, index) => (
                            <p key={index}>{line || "\u00A0"}</p>
                        ))}
                    </div>
                    {cta && cta.length > 0 && (
                        <div className="specials-popup-cta">
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
    );
}

