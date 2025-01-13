import { saveArticle } from "../models/articles.model.js";


export const createArticle = async (req, res) => {
    try {
        const { title, category, content } = req.body
        const user = req.user.id;

        const article = await saveArticle(user, category, title, content);

        return res.status(201).json({ message: "Article created", article })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err })
    }
}