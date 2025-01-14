import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const saveUser = async (firstName, lastName, pseudo, email, roleId, hash) => {

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

export const findUserById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                user.id AS user_id, 
                user.first_name, 
                user.last_name, 
                user.pseudo, 
                user.email, 
                user.refresh_token, 
                role.name AS role_name
            FROM user 
            LEFT JOIN role ON user.role_id = role.id
            WHERE user.id = ? AND user.deleted_at IS NULL
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


export const findByCredentials = async (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT email, id, password FROM user WHERE email = ? AND deleted_at IS NULL';
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
        // Exclure l'email des mises à jour
        const { email, ...allowedUpdates } = user;

        // Extraire les colonnes à mettre à jour
        const columns = Object.keys(allowedUpdates);
        if (columns.length === 0) {
            return reject(new Error("Aucune donnée valide à mettre à jour."));
        }

        // Construire dynamiquement la requête SQL
        const setClause = columns.map(column => `${column} = ?`).join(", ");
        const values = columns.map(column => allowedUpdates[column]);

        const sql = `UPDATE user SET ${setClause} WHERE id = ?`;
        values.push(id); // Ajouter l'id à la fin pour la condition WHERE

        // console.log(`SQL Query: ${sql}`);
        // console.log(`Values: ${values}`);

        db.query(sql, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null); // Aucun utilisateur mis à jour
            }
            return resolve(result); // Résultat de la mise à jour
        });
    });
}
