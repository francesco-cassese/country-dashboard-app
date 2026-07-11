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

    }
}

export default Favorite;