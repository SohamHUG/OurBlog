import db from '../config/db.js';


export const searchArticlesAndUsers = async (query, limit) => {
    const searchTerm = `%${query}%`; // recherche partielle

    let sql = `
        SELECT 
            'article' AS type,
            article.id AS id,
            article.title AS name,
            article.content AS description,
            NULL AS picture
        FROM article
        WHERE article.title LIKE ? OR article.content LIKE ?
        

        UNION ALL

        SELECT 
            'user' AS type,
            user.id AS id,
            user.pseudo AS name,
            CONCAT(user.first_name, ' ', user.last_name) AS description,
            user.profil_picture AS picture
        FROM user
        WHERE user.pseudo LIKE ? OR user.first_name LIKE ? OR user.last_name LIKE ?

        UNION ALL

        SELECT 
            'category' AS type,
            category.id AS id,
            category.name AS name,
            NULL AS description,
            NULL AS picture
        FROM category
        WHERE  category.name LIKE ? 
    `;

    if (limit) sql += ` LIMIT 10`;

    const params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    // console.log(sql)

    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};