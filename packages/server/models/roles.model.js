import db from '../config/db.js';

export const findAllRoles = async () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                name, id
            FROM role 
        `;

        db.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};