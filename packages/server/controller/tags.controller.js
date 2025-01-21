import { findTags } from "../models/tags.model.js";

export const getTags = async (req, res) => {
    try {
        const data = await findTags();

        return res.status(201).json({ data })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}