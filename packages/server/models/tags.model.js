import db from '../config/db.js';

export const findTags = async (category) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT DISTINCT tag.id, tag.name FROM tag';

        if (category) {
            // console.log(category)
            sql += `
            INNER JOIN article_tag ON tag.id = article_tag.tag_id
            INNER JOIN article ON article_tag.article_id = article.id
            INNER JOIN category ON article.category_id = category.id
            WHERE category.name = ?
            `
        }

        sql += ` ORDER BY tag.name`;

        db.query(sql, category, (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result);
        })
    })
}

export const findTagByName = async (name) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, name FROM tag WHERE name = ?';

        db.query(sql, name, (err, result) => {
            if (err) {
                reject(err)
            }
            if (!result[0]) {
                return resolve(null);
            }

            resolve(result);
        })
    })
}

export const saveTag = async (name) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tag (name) VALUES (?)';

        db.query(sql, name, (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result.insertId);
        })
    })
}

export const linkArticleToTag = async (articleId, tagId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO article_tag (article_id, tag_id) VALUES (?, ?)';

        db.query(sql, [articleId, tagId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

export const deleteArticleTags = (articleId) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM article_tag WHERE article_id = ?`;
        db.query(sql, [articleId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

export const deleteTagById = (tagId) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM tag WHERE id = ?`;
        db.query(sql, [tagId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
