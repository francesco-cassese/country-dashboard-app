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

    },

    delete: async (id) => {

        const query = `
                DELETE
                FROM preferiti
                WHERE id = ?
        `

        const [result] = await connection.execute(query, [id]);

        return result.affectedRows > 0;
    }
}

export default Favorite;