const BASE_URL = import.meta.env.VITE_API_URL_BACKEND;

const apiFetch = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options)

        if (!response.ok) {
            throw new Error(`Errore http: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || `Errore generico dal Server `)
        }

        return result.data;

    } catch (error) {

        console.error("API Fetch Error:", error.message);

        throw error;
    }

}