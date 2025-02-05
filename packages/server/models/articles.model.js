import db from '../config/db.js';

export const saveArticle = async (user, category, title, content) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO article (user_id, category_id, title, content) VALUES (?,?,?,?)';

        db.query(sql, [user, category, title, content], async (err, result) => {
            if (err) {
                reject(err)
            }

            // console.log(result.insertId)
            resolve(result.insertId);
        })
    })
}

export const updateArticleById = async (id, article) => {
    return new Promise((resolve, reject) => {

        const { ...allowedUpdates } = article;

        const columns = Object.keys(allowedUpdates)

        if (columns.length === 0) {
            return reject(new Error("Aucune donnée valide à mettre à jour."));
        }

        columns.push('updated_at');
        allowedUpdates['updated_at'] = new Date();

        // construire dynamiquement la requête SQL
        const setClause = columns.map(column => `${column} = ?`).join(", ");
        const values = columns.map(column => allowedUpdates[column]);

        const sql = `UPDATE article SET ${setClause} WHERE id = ?`;
        values.push(id);

        db.query(sql, values, async (err, result) => {
            if (err) {
                reject(err)
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            const newArticleData = await findArticleById(id);

            resolve(newArticleData);
        })
    })
}

export const findAllArticles = (filters = {}) => {
    return new Promise((resolve, reject) => {
        let sql = `
        SELECT 
            article.id, 
            article.user_id, 
            user.pseudo as user_pseudo,
            user.profil_picture as user_picture,
            article.category_id, 
            category.name as category_name, 
            article.title, 
            article.content,
            article.created_at,
            COUNT(comment.id) AS comment_count
        FROM article
        INNER JOIN user ON article.user_id = user.id
        INNER JOIN category ON article.category_id = category.id
        LEFT JOIN article_tag ON article.id = article_tag.article_id
        LEFT JOIN tag ON article_tag.tag_id = tag.id
        LEFT JOIN comment ON article.id = comment.article_id
        WHERE 1=1
        `;

        const params = [];

        if (filters.userId) {
            sql += ` AND article.user_id = ?`;
            params.push(filters.userId);
        }
        if (filters.category) {
            sql += ` AND category.name = ?`;
            params.push(filters.category);
        }
        if (filters.tags && filters.tags.length > 0) {
            const tagList = filters.tags.map(tag => tag.trim());
            sql += ` AND tag.name IN (${tagList.map(() => '?').join(', ')})`;
            params.push(...tagList);

            sql += ` GROUP BY article.id HAVING COUNT(DISTINCT tag.name) = ?`;
            params.push(tagList.length);
        } else {
            sql += ` GROUP BY article.id`;
        }



        if (filters.sortBy === 'famous') {
            sql += ` ORDER BY comment_count DESC`;
        } else {
            sql += ` ORDER BY article.created_at DESC`;
        }

        // sql += ` ORDER BY article.created_at DESC`;

        // console.log(sql)

        db.query(sql, params, (err, result) => {
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
            GROUP_CONCAT(tag.name SEPARATOR ', ') as tags,
            article.title, 
            article.content 
        FROM article
        INNER JOIN user ON article.user_id = user.id
        INNER JOIN category ON article.category_id = category.id
        LEFT JOIN article_tag ON article.id = article_tag.article_id
        LEFT JOIN tag ON article_tag.tag_id = tag.id
        WHERE article.id = ?
        GROUP BY article.id;
        `;

        db.query(sql, id, (err, result) => {
            if (err) {
                reject(err)
            }
            if (!result[0]) {
                return resolve(null);
            }

            resolve(result[0]);
        })
    })
}

export const deleteArticleById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM article WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result) {
                return resolve(result)
            }
        })
    })
}