import { getAuthHeader } from "../oidc.js";

export const fetchWithAuth = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const header = await getAuthHeader();
    console.log(header, url)
    const response = await fetch(url, {
        ...options,

        headers: {
            ...options?.headers,
            ...(header ? header : {}),
        },
    });

    let data = undefined;
    if (response.status !== 204) {
        // 204 : No Content
        data = await response.json();
    }
    // Correspond aux format créés par orval
    return {
        status: response.status,
        data,
        headers: response.headers,
    } as T;
};
