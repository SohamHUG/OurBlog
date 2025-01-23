import db from '../config/db.js';

export const findTags = async () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, name FROM tag';

        db.query(sql, (err, result) => {
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

