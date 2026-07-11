import connection from "../database/connection.js";

const Favorite = {
    getAll: async () => {

        const query = `
                SELECT *
                FROM preferiti
                WHERE 1;
        `;

        const [rows] = await connection.execute(query);

        return rows;

    },

    create: async (data) => {

        const { api_id, titolo, paese, contenuto } = data;

        const query = `
        INSERT INTO preferiti(api_id, titolo, paese, contenuto, created_at)
        VALUES (?,?,?,?, NOW())
        `

        const [result] = await connection.execute(query, [api_id, titolo, paese, contenuto])

        return result.insertId;

    }
}

export default Favorite;