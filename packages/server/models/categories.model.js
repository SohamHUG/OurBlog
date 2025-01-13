import db from '../config/db.js';

export const fetchCategories = async () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, name FROM category WHERE deleted_at IS NULL';
        db.query(sql, (err, result) => {
            if (err) {
                return reject(err)
            }
            return resolve(result)
        })

    })
}

export const fetchCategoryById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, name FROM category WHERE id = ? AND deleted_at IS NULL';
        db.query(sql,[id], (err, result) => {
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

export const saveCategory = async (name) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO category (name) VALUES (?)';
        db.query(sql,[name], async (err, result) => {
            if (err) {
                return reject(err)
            }
            const category = await fetchCategoryById(result.insertId)
            return resolve(category)
        })

    })
}

export const deleteCategoryById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM category WHERE category.id = ?';
        db.query(sql,[id], async (err, result) => {
            if (err) {
                return reject(err)
            }
            return resolve(result)
        })

    })
}