import { findTags } from "../models/tags.model.js";

export const getTags = async (req, res) => {
    try {
        const category =  req.query.category
        
        const tags = await findTags(category);

        return res.status(201).json({ tags })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: err });
    }
}