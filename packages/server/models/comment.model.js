import db from '../config/db.js';

export const saveComment = async (articleId, userId, comment) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO comment (article_id, user_id, content) VALUES (?,?,?)';

        db.query(sql, [articleId, userId, comment], async (err, result) => {
            if (err) {
                reject(err)
            }

            // console.log(result)
            const comment = await findCommentById(result.insertId)
            resolve(comment);
        })
    })
}

export const findAllComments = async (filters = {}) => {
    return new Promise((resolve, reject) => {
        let sql = `
        SELECT
            comment.id,
            comment.article_id,
            comment.user_id,
            comment.content,
            user.pseudo as user_pseudo,
            user.profil_picture as user_picture,
            comment.created_at
        FROM comment
        INNER JOIN user ON comment.user_id = user.id
        WHERE 1=1
        `;

        const params = [];

        if (filters.articleId) {
            sql += ` AND comment.article_id = ?`
            params.push(filters.articleId)
        }

        if (filters.userId) {
            sql += ` AND comment.user_id = ?`
            params.push(filters.userId)
        }

        sql += ` ORDER BY comment.created_at ASC`

        db.query(sql, params, async (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result);
        })
    })
}

export const findCommentById = async (id) => {
    return new Promise((resolve, reject) => {
        let sql = `
        SELECT
            comment.id,
            comment.article_id,
            comment.user_id,
            comment.content,
            user.pseudo as user_pseudo,
            user.profil_picture as user_picture,
            comment.created_at
        FROM comment
        INNER JOIN user ON comment.user_id = user.id
        WHERE comment.id = ?
        `;

        db.query(sql, id, async (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result);
        })
    })
}

export const deleteCommentById = async (id) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM comment WHERE id = ?`;

        db.query(sql, [id], async (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result);
        })
    })
}