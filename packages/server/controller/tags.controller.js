import { deleteTagById, findTags } from "../models/tags.model.js";

export const getTags = async (req, res) => {
    try {
        const category = req.query.category

        const tags = await findTags(category);

        return res.status(201).json({ tags })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
}

export const deleteTag = async (req, res) => {
    try {
        const tagId = req.params.id

        await deleteTagById(tagId);

        return res.status(200).json({ message: "Tag supprimé" })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
}