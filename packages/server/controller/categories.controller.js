import { deleteCategoryById, fetchCategories, fetchCategoryById, saveCategory } from "../models/categories.model.js"


export const getCategories = async (req, res) => {
    try {
        const data = await fetchCategories();
        
        return res.status(201).json({data})
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: err});
    }
}

export const getCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const data = await fetchCategoryById(categoryId);

        return res.status(201).json({data})
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: err});
    }
}

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body
        const data = await saveCategory(name)

        return res.status(201).json({data})
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: err});
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const data = await deleteCategoryById(categoryId)

        return res.status(201).json({message: "category deleted !", data})
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: err});
    }
}