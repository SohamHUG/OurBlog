import { findAllArticles, findArticleById, saveArticle } from "../models/articles.model.js";


export const createArticle = async (req, res) => {
    try {
        const { title, category, content } = req.body
        const user = req.user.user_id;

        const article = await saveArticle(user, category, title, content);

        return res.status(201).json({ message: "Article created", article })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err })
    }
}

export const getArticles = async (req, res) => {
    try {

        // console.log(req.query)
        const articles = await findAllArticles();

        return res.status(200).json({ articles })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err })
    }
}

export const getArticleById = async (req, res) => {
    try {
        const { id } = req.params
        // console.log(req.query)
        const article = await findArticleById(id);

        if (article.length === 0 ) {
            return res.status(404).json({ message: 'Aucun article' })
        }

        return res.status(200).json({ article })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err })
    }
}