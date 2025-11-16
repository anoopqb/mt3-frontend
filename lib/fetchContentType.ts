import qs from 'qs';
/**
 * Fetches data for a specified Strapi content type.
 *
 * @param {string} contentType - The type of content to fetch from Strapi.
 * @param {string} params - Query parameters to append to the API request.
 * @param {boolean} spreadData - Whether to spread the data response.
 * @param {boolean} isDraftMode - Whether draft mode is enabled.
 * @return {Promise<object>} The fetched data.
 */

export interface StrapiData {
    id: number;
    [key: string]: unknown; // Allow for any additional fields
}

interface StrapiResponse {
    data: StrapiData | StrapiData[];
}

export function spreadStrapiData(data: StrapiResponse): StrapiData | null {
    if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data[0];
    }
    if (!Array.isArray(data.data)) {
        return data.data;
    }
    return null;
}

export default async function fetchContentType(
    contentType: string,
    params: Record<string, unknown> = {},
    spreadData?: boolean,
): Promise<StrapiResponse | StrapiData | null | undefined> {
    try {


        const queryParams = { ...params };

        // Construct the full URL for the API request
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
        const url = new URL(
            `/api/${contentType}`,
            apiUrl
        );

        // Get bearer token from environment variable
        const token = process.env.NEXT_PUBLIC_API_TOKEN;

        const response = await fetch(`${url.href}?${qs.stringify(queryParams)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch data from Strapi (url=${url.toString()}, status=${response.status})`
            );
        }

        const jsonData: StrapiResponse = await response.json();
        return spreadData ? spreadStrapiData(jsonData) : jsonData;
    } catch (error) {
        console.error('FetchContentTypeError', error);
    }
}