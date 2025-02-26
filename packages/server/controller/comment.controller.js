import { deleteCommentById, findAllComments, findCommentById, saveComment } from "../models/comment.model.js";

export const createComment = async (req, res) => {
    const comment = req.body.comment;
    const articleId = req.params.id;
    const userId = req.user.user_id;
    try {

        const comm = await saveComment(articleId, userId, comment);

        return res.status(201).json({ message: "Comment created", comment: comm });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }

}

export const getComments = async (req, res) => {
    try {
        const filters = {
            articleId: req.query.articleId,
            userId: req.query.userId,
        };

        const comments = await findAllComments(filters);

        return res.status(200).json({ comments })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }

}

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const comment = await findCommentById(id)

        if (
            comment[0].user_id !== user.user_id &&
            user.role_id !== 4 &&
            user.role_id !== 2
        ) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
        }

        await deleteCommentById(id)

        return res.status(200).json({ message: "Commentaire supprimé" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }

}