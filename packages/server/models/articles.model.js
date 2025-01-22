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

export const findAllArticles = () => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT 
            article.id, 
            article.user_id, 
            user.pseudo as user_pseudo,
            user.profil_picture as user_picture,
            article.category_id, 
            category.name as category_name, 
            article.title, 
            article.content 
        FROM article
        LEFT JOIN user ON article.user_id = user.id
        LEFT JOIN category ON article.category_id = category.id
        `;

        db.query(sql, (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result);
        })
    })
}

export const findArticleById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT 
            article.id, 
            article.user_id, 
            user.pseudo as user_pseudo,
            user.profil_picture as user_picture,
            article.category_id, 
            category.name as category_name, 
            article.title, 
            article.content 
        FROM article
        LEFT JOIN user ON article.user_id = user.id
        LEFT JOIN category ON article.category_id = category.id
        WHERE article.id = ?
        `;

        db.query(sql, id, (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result);
        })
    })
}