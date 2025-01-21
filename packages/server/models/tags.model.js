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