import { findAllComments, saveComment } from "../models/comment.model.js";

export const createComment = async (req, res) => {
    const comment = req.body.comment;
    const articleId = req.params.id;
    const userId = req.user.user_id;

    const comm = await saveComment(articleId, userId, comment);

    return res.status(201).json({ message: "Comment created", comment: comm });

}

export const getComments = async (req, res) => {
    try {
        const filters = {
            articleId: req.query.articleId,
        };

        const comments = await findAllComments(filters);

        return res.status(200).json({ comments })

    } catch (error) {
        console.error(err);
        return res.status(500).json({ message: err })
    }

}