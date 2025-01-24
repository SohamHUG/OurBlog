import { findAllArticles, findArticleById, saveArticle } from "../models/articles.model.js";
import { findTagByName, findTags, saveTag, linkArticleToTag } from "../models/tags.model.js";


export const createArticle = async (req, res) => {
    try {
        const { title, category, content, tags } = req.body
        const user = req.user.user_id;

        const article = await saveArticle(user, category, title, content);

        const existingTags = await findTags();
        const existingTagMap = new Map(existingTags.map(tag => [tag.name, tag.id]));
        // map transforme l'obj en paire [name, id]
        // new Map() transforme les paires en objet contenant les paires (clé-valeur) ce qui permet de faciliter le traitement des tags 
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

        if (article.length === 0) {
            return res.status(404).json({ message: 'Aucun article' })
        }

        return res.status(200).json({ article })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err })
    }
}