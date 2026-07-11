const BASE_URL = import.meta.env.VITE_API_URL_BACKEND;
const DEMO_KEY = import.meta.env.VITE_DEMO_KEY_REST_COUNTRIES;

const apiFetch = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`Errore http: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Errore generico dal Server");
        }

        return result.data;
    } catch (error) {
        console.error("API Fetch Error:", error.message);
        throw error;
    }
};

const externalDataFetch = async (url) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${DEMO_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Errore http ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Errore nella chiamata esterna:", error);
        throw error;
    }
};

export { apiFetch, externalDataFetch };