import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const saveUser = async (userData) => {
    const { firstName, lastName, pseudo, email, roleId, hash } = userData;

    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user (first_name, last_name, pseudo, email, role_id, password) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [firstName, lastName, pseudo, email, roleId, hash], async (err, result) => {
            if (err) {
                reject(err)
            }
            const user = await findUserById(result.insertId)
            // console.log(user)
            resolve(user)
        })
    })
}

export const findAllUsers = async () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                user.id AS user_id, 
                user.first_name, 
                user.last_name, 
                user.pseudo, 
                user.email, 
                user.profil_picture,
                user.profil_picture_public_id,
                is_verified,
                role.name AS role_name,
                user.role_id
            FROM user 
            INNER JOIN role ON user.role_id = role.id
            ORDER BY 
                (user.first_name IS NOT NULL AND user.last_name IS NOT NULL AND user.is_verified = 1 AND user.role_id = 1) DESC,
                (user.is_verified = 0 AND user.role_id = 3) DESC,
                (user.is_verified = 0) DESC,
                (user.role_id = 2) DESC,
                user.role_id ASC;
        `;

        db.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            }
            // if (!result[0]) {
            //     return resolve(null);
            // }
            return resolve(result);
        });
    });
};

export const findUserById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                user.id AS user_id, 
                user.first_name, 
                user.last_name, 
                user.pseudo, 
                user.email, 
                user.profil_picture,
                user.profil_picture_public_id,
                user.refresh_token, 
                is_verified,
                role.name AS role_name,
                user.role_id
            FROM user 
            INNER JOIN role ON user.role_id = role.id
            WHERE user.id = ? 
        `;

        db.query(sql, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (!result[0]) {
                return resolve(null);
            }
            return resolve(result[0]);
        });
    });
};

export const findPopularUsers = async () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                user.id, 
                user.first_name, 
                user.last_name, 
                user.pseudo, 
                user.profil_picture,
                user.profil_picture_public_id,
                COUNT(DISTINCT comment.id) AS total_comments
            FROM user 
            INNER JOIN role ON user.role_id = role.id
            INNER JOIN article ON user.id = article.user_id
            LEFT JOIN comment ON article.id = comment.article_id
            GROUP BY user.id
            ORDER BY total_comments DESC
            LIMIT 10
        `;

        db.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};


export const findByCredentials = async (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT email, id, password FROM user WHERE email = ?';
        db.query(sql, [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result) {
                return resolve(result)
            }
        })
    })
}

export const updateUserById = async (id, user) => {
    return new Promise((resolve, reject) => {
        const { ...allowedUpdates } = user;

        // const validColumns = [
        //     'first_name',
        //     'last_name',
        //     'email',
        //     'pseudo',
        //     'refresh_token',
        //     'is_verified',
        //     'profil_picture',
        //     'profil_picture_public_id',
        //     'role_id',
        //     'password'
        // ];

        // extraie les colonnes à mettre à jour
        const columns = Object.keys(allowedUpdates)
        // .filter(column => validColumns.includes(column));

        if (columns.length === 0) {
            return reject(new Error("Aucune donnée valide à mettre à jour."));
        }

        // modifier la colonne updated_at 
        columns.push('updated_at');
        allowedUpdates['updated_at'] = new Date();

        // construire dynamiquement la requête SQL
        const setClause = columns.map(column => `${column} = ?`).join(", ");
        const values = columns.map(column => allowedUpdates[column]);

        const sql = `UPDATE user SET ${setClause} WHERE id = ?`;
        values.push(id); // ajout de l'id à la fin pour la condition WHERE

        // console.log(`SQL Query: ${sql}`);
        // console.log(`Values: ${values}`);
        // console.log(`SET: ${setClause}`);
        // console.log(`sql: ${sql}`);

        db.query(sql, values, async (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null); // Aucun utilisateur mis à jour
            }
            const newUserData = await findUserById(id)
            // console.log(user)
            resolve(newUserData) // Résultat 
        });
    });
}

export const deleteUserById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM user WHERE id = ?';
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