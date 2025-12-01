/**
 * Fetches data from Strapi API with bearer token authentication
 * @param endpoint - The API endpoint (e.g., '/sites?populate=logo' or '/header-navigations')
 * @param options - Optional fetch options (method, body, etc.)
 * @returns Promise with the response data
 */
export async function fetchStrapiData<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1338/api";
    const bearerToken = process.env.NEXT_PUBLIC_API_TOKEN;

    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${apiUrl}${normalizedEndpoint}`;

    // Prepare headers
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };


    // Merge existing headers if provided
    if (options.headers) {
        if (options.headers instanceof Headers) {
            options.headers.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (Array.isArray(options.headers)) {
            options.headers.forEach(([key, value]) => {
                headers[key] = value;
            });
        } else {
            Object.assign(headers, options.headers);
        }
    }

    // Add bearer token if available
    if (bearerToken) {
        headers.Authorization = `Bearer ${bearerToken}`;
    }

    // Merge options
    const fetchOptions: RequestInit = {
        ...options,
        cache: "force-cache",
        headers,
    };

    try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Strapi API error: ${response.status} ${response.statusText}. ${errorText}`
            );
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch from Strapi: ${error.message}`);
        }
        throw new Error("Failed to fetch from Strapi: Unknown error");
    }
}

/**
 * Fetches data from Strapi API with bearer token authentication (Server Component)
 * Includes Next.js revalidation options for caching
 * @param endpoint - The API endpoint
 * @param options - Optional fetch options
 * @returns Promise with the response data
 */
export async function fetchApiData<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    return fetchStrapiData<T>(endpoint, {
        ...options,
        cache: "force-cache",
    });
}

