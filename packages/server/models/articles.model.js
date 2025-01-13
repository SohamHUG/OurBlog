import db from '../config/db.js';

export const saveArticle = async (user, category, title, content) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO article (user_id, category_id, title, content) VALUES (?,?,?,?)';

        db.query(sql, [user, category, title, content], async (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result);
        })
    })
}