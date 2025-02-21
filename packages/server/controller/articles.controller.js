import { deleteArticleById, findAllArticles, findArticleById, saveArticle, updateArticleById } from "../models/articles.model.js";
import { findTagByName, findTags, saveTag, linkArticleToTag, deleteArticleTags } from "../models/tags.model.js";
import sanitizeHtml from 'sanitize-html';


export const createArticle = async (req, res) => {
    try {
        const { title, category, content, tags } = req.body
        const user = req.user.user_id;

        // console.log(content)
        if (!title || title.trim() === "" ||
            !category || category.trim() === "" ||
            !content || content.replace(/<[^>]+>/g, '').trim() === "") {

            return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
        }

        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: [
                'p', 'h1', 'h2', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'img', 'blockquote', 'span'
            ],
            allowedAttributes: {
                a: ['href', 'target', 'rel', 'class', 'style'],
                img: ['src', 'alt', 'class', 'style'],
                span: ['class', 'style'],
                strong: ['class', 'style'],
                p: ['class', 'style'],
                u: ['class', 'style'],
                h1: ['class', 'style'],
                h2: ['class', 'style'],
                em: ['class', 'style'],
                li: ['class', 'style'],
                blockquote: ['class', 'style'],
            },
            allowedStyles: {
                '*': {
                    // Limiter les styles autorisés
                    'color': [/^#([0-9a-f]{3}){1,2}$/i, /^rgb\(/, /^rgba\(/, /^(red)$/i], // Autorise uniquement les couleurs valides
                    'font-size': [/^\d+(px|em|rem|%)$/], // Évite les valeurs arbitraires
                    'text-align': [/^(left|right|center|justify)$/],
                    'font-weight': [/^(normal|bold|lighter|bolder|[1-9]00)$/],
                    'text-decoration': [/^(none|underline|line-through|overline)$/],
                }
            },
            transformTags: {
                'a': (tagName, attribs) => {
                    if (attribs.href && !attribs.href.startsWith('#') && !attribs.href.startsWith('/')) {
                        attribs.rel = 'noopener noreferrer'; // Sécurise les liens externes
                        attribs.target = '_blank'; // Ouvre les liens externes dans un nouvel onglet
                    }
                    return {
                        tagName,
                        attribs
                    };
                }
            },
            disallowedTagsMode: 'discard',
        });

        const article = await saveArticle(user, category, title, sanitizedContent);

        const existingTags = await findTags();
        const existingTagMap = new Map(existingTags.map(tag => [tag.name, tag.id]));

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

            await linkArticleToTag(article.id, tagId);
        }

        return res.status(201).json({ message: "Article created", article })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
}

export const updateArticle = async (req, res) => {
    try {
        const { id } = req.params
        const { title, category, content, tags } = req.body
        const user = req.user.user_id;

        // console.log(content)

        if (!title || title.trim() === "" ||
            !category ||
            !content || content.replace(/<[^>]+>/g, '').trim() === "") {

            return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
        }

        const article = await findArticleById(id);

        if (!article || article.length <= 0) {
            return res.status(404).json({ message: "Article introuvable" });
        }

        if (article.user_id !== user && req.user.role_name !== "admin") {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
        }

        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: [
                'p', 'h1', 'h2', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'img', 'blockquote', 'span'
            ],
            allowedAttributes: {
                a: ['href', 'target', 'rel', 'class', 'style'],
                img: ['src', 'alt', 'class', 'style'],
                span: ['class', 'style'],
                strong: ['class', 'style'],
                p: ['class', 'style'],
                u: ['class', 'style'],
                h1: ['class', 'style'],
                h2: ['class', 'style'],
                em: ['class', 'style'],
                li: ['class', 'style'],
                blockquote: ['class', 'style'],
            },
            allowedStyles: {
                '*': {
                    // Limiter les styles autorisés
                    'color': [/^#([0-9a-f]{3}){1,2}$/i, /^rgb\(/, /^rgba\(/, /^(red)$/i], // Autorise uniquement les couleurs valides
                    'font-size': [/^\d+(px|em|rem|%)$/], // Évite les valeurs arbitraires
                    'text-align': [/^(left|right|center|justify)$/],
                    'font-weight': [/^(normal|bold|lighter|bolder|[1-9]00)$/],
                    'text-decoration': [/^(none|underline|line-through|overline)$/],
                }
            },
            // transformTags: {
            //     'a': (tagName, attribs) => {
            //         if (attribs.href && !attribs.href.startsWith('#') && !attribs.href.startsWith('/')) {
            //             attribs.rel = 'noopener noreferrer'; // Sécurise les liens externes
            //             attribs.target = '_blank'; // Ouvre les liens externes dans un nouvel onglet
            //         }
            //         return {
            //             tagName,
            //             attribs
            //         };
            //     }
            // },
            disallowedTagsMode: 'discard',
        });

        const updateArticle = {
            title: title,
            category_id: category,
            content: sanitizedContent
        }

        const updatedArticle = await updateArticleById(id, updateArticle);

        await deleteArticleTags(updatedArticle.id);

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

            await linkArticleToTag(updatedArticle.id, tagId);
        }

        return res.status(201).json({ message: "Article mis à jour avec succès", article: updatedArticle })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
}

export const getArticles = async (req, res) => {
    try {
        const filters = {
            userId: req.query.userId,
            category: req.query.category,
            sortBy: req.query.sortBy,
            tags: req.query.tags ? req.query.tags.split(',') : [],
            page: parseInt(req.query.page),
            limit: parseInt(req.query.limit)
        };

        // console.log(filters)
        const articles = await findAllArticles(filters);

        return res.status(200).json({ articles })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur interne du serveur." });
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
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
}

export const deleteArticle = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const article = await findArticleById(id);

        if (!article || article.length <= 0) {
            return res.status(404).json({ message: "Article introuvable" });
        }

        if (article.user_id !== user.user_id && req.user.role_name !== "admin") {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
        }

        await deleteArticleById(id);

        return res.status(200).json({ message: "Article supprimé" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
}