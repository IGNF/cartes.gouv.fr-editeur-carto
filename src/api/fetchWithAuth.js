import { getAuthHeader } from "../oidc";

export const fetchWithAuth = async (url, options) => {
    const header = await getAuthHeader();
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
    };
};
