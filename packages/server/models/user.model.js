import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const saveUser = async (firstName, lastName, pseudo, email, password) => {

    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user (first_name, last_name, pseudo, email, password) VALUES (?, ?, ?, ?, ?)';
        const hash = bcrypt.hashSync(password, 10);
        db.query(sql, [firstName, lastName, pseudo, email, hash], async(err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return reject('duplicate')
                } else if (err.code === 'ER_DATA_TOO_LONG') {
                    return reject('toolong')
                }
                reject(err)
            }
            const user = await getUserById(result.insertId)
            // console.log(user)
            resolve(user)
        })
    })
}

export const verifyUser = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user SET is_verified = true WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                return reject(err)
            }
            return resolve(result)
        })

    })
}

export const getUserById = async (id) => {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, first_name, last_name, pseudo, email, role_id FROM user WHERE id = ? and deleted_at IS NULL';
        db.query(sql, [id], (err, result) => {
            if (err) {
                return reject(err)
            }
            if (!result[0]) {
                return resolve(null)
            }
            return resolve(result[0])
        })

    })
}

export const getUserLogin = async (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT email, id, password FROM user WHERE email = ? AND deleted_at IS NULL';
        db.query(sql, [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result[0]) {
                if (bcrypt.compareSync(password, result[0].password)) {
                    resolve(result[0])
                } else if (result[0].length === 0 || !bcrypt.compareSync(password, result[0].password)) {
                    reject('invalid email or password')
                }
                resolve(result[0])
            } else {
                reject('error')
            }

        })
    })
}

export const getRoleById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name FROM role WHERE id = ? AND deleted_at IS NULL';
        db.query(sql, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (!result[0]) {
                return resolve(null)
            }
            return resolve(result[0])

        })
    })
}
