import { deleteArticleById, findAllArticles, findArticleById, saveArticle, updateArticleById } from "../models/articles.model.js";
import { findTagByName, findTags, saveTag, linkArticleToTag, deleteArticleTags } from "../models/tags.model.js";


export const createArticle = async (req, res) => {
    try {
        const { title, category, content, tags } = req.body
        const user = req.user.user_id;

        const article = await saveArticle(user, category, title, content);

        const existingTags = await findTags();
        const existingTagMap = new Map(existingTags.map(tag => [tag.name, tag.id]));
        // map transforme l'obj en paire [name, id]
        // new Map()
        // Map {
        //     "name" => id,
        //     "recette" => 2,
        //     "dessert" => 3
        //   }
        // existingTagMap.has("cuisine"); // renvoie un boolean
        // existingTagMap.get("cuisine"); // renvoie l'id 
        // existingTagMap.set(tagName, tagId); // ajoute une nouvelle valeure a l'obj 


        // Gère les tags
        for (const tagName of tags.filter(tag => tag.trim() !== '')) {
            let tagId;

            if (existingTagMap.has(tagName.toLowerCase().trim())) {
                tagId = existingTagMap.get(tagName.toLowerCase().trim());
            } else {

                tagId = await saveTag(tagName.toLowerCase().trim());
                existingTagMap.set(tagName.toLowerCase().trim(), tagId);
            }

            await linkArticleToTag(article, tagId);
        }

        return res.status(201).json({ message: "Article created", article })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err })
    }
}

export const updateArticle = async (req, res) => {
    try {
        const { id } = req.params
        const { title, category, content, tags } = req.body
        const user = req.user.user_id;

        const oldArticle = await findArticleById(id);

        if (!oldArticle || oldArticle.length <= 0) {
            return res.status(404).json({ message: "Article introuvable" });
        }

        if (oldArticle.user_id !== user && req.user.role_name !== "admin") {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
        }

        const updateArticle = {
            title: title,
            category_id: category,
            content: content
        }

        const newArticle = await updateArticleById(id, updateArticle);

        await deleteArticleTags(newArticle.id);

        const existingTags = await findTags();
        const existingTagMap = new Map(existingTags.map(tag => [tag.name, tag.id]));

        // Gère les tags
        for (const tagName of tags.filter(tag => tag.trim() !== '')) {
            let tagId;

            if (existingTagMap.has(tagName.toLowerCase().trim())) {
                tagId = existingTagMap.get(tagName.toLowerCase().trim());
            } else {
                tagId = await saveTag(tagName.toLowerCase().trim());
                existingTagMap.set(tagName.toLowerCase().trim(), tagId);
            }

            await linkArticleToTag(newArticle.id, tagId);
        }

        return res.status(201).json({ message: "Article mis à jour avec succès", article: newArticle })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err })
    }
}

export const getArticles = async (req, res) => {
    try {
        const filters = {
            userId: req.query.userId,
            category: req.query.category,
            sortBy: req.query.sortBy,
            tags: req.query.tags ? req.query.tags.split(',') : [],
        };

        // console.log(filters)
        const articles = await findAllArticles(filters);

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

        if (!article || article.length === 0) {
            return res.status(404).json({ message: 'Aucun article' })
        }

        return res.status(200).json({ article })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err })
    }
}

export const deleteArticle = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    const article = await findArticleById(id);

    if (!article || article.length <= 0) {
        return res.status(404).json({ message: "Article introuvable" });
    }

    if (article.user_id !== user.user_id && req.user.role_name !== "admin") {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
    }
    
    await deleteArticleById(id);



    return res.status(200).json({ message: "Article supprimé" });
}