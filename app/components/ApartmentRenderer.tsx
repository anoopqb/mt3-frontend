'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ApartmentRenderer() {
    // Get floorplanId from URL search params
    const searchParams = useSearchParams();
    const floorplanId = searchParams.get('floorplan');

    // State to store the fetched HTML content
    const [html, setHtml] = useState('');
    // State to handle fetching status
    const [loading, setLoading] = useState(true);
    // State to track if resources are fully loaded
    const [resourcesLoaded, setResourcesLoaded] = useState(false);
    // State to handle potential errors
    const [error, setError] = useState<string | null>(null);
    // Ref to the container div
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!floorplanId) {
            setError('No floorplan ID provided in URL');
            setLoading(false);
            return;
        }

        const fetchFloorPlans = async () => {
            try {
                const response = await fetch(`https://bozzuto-floorplans-dev.s3.us-east-1.amazonaws.com/p1526057/units.html?floorplan=${floorplanId}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const data = await response.text();
                setHtml(data);
            } catch (err) {
                console.error("Error loading floorplans:", err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchFloorPlans();
    }, [floorplanId]);

    // Wait for all resources (images, CSS, etc.) to load after HTML is inserted
    useEffect(() => {
        if (!html || loading) return;

        const container = containerRef.current;
        if (!container) return;

        // Function to execute scripts from the HTML
        const executeScripts = () => {
            const scripts = container.querySelectorAll('script');
            scripts.forEach((oldScript) => {
                const newScript = document.createElement('script');
                
                // Copy attributes
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                
                // Copy inline script content
                if (oldScript.innerHTML) {
                    newScript.innerHTML = oldScript.innerHTML;
                }
                
                // Replace old script with new one to trigger execution
                oldScript.parentNode?.replaceChild(newScript, oldScript);
            });
        };

        const checkResourcesLoaded = () => {
            // Get all stylesheets in the container
            const stylesheets = Array.from(container.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));

            // Check if all stylesheets are loaded
            const stylesheetsLoaded = stylesheets.every((link: HTMLLinkElement) => {
                // If the stylesheet is from the same origin, we can check if it's loaded
                try {
                    return link.sheet !== null;
                } catch {
                    // Cross-origin stylesheets might throw an error, assume loaded
                    return true;
                }
            });

            if (stylesheetsLoaded) {
                setResourcesLoaded(true);
                // Execute scripts after resources are loaded
                executeScripts();
            } else {
                // Wait a bit and check again
                setTimeout(checkResourcesLoaded, 100);
            }
        };

        // Small delay to ensure DOM is updated
        setTimeout(checkResourcesLoaded, 50);
    }, [html, loading]);

    if (loading) {
        return <div className="p-4">Loading floor plans...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <>
            {/* Hidden container to load resources */}
            <div
                ref={containerRef}
                style={{
                    opacity: resourcesLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                }}
                dangerouslySetInnerHTML={{ __html: html }}
            />
            {/* Show loading indicator while resources are loading */}
            {!resourcesLoaded && (
                <div className="p-4">Loading resources...</div>
            )}
        </>
    );
}
