import { searchArticlesAndUsers } from "../models/search.model.js";

export const search = async (req, res) => {
    const query = req.query.q
    const limit = req.query.limit
    // console.log(query)
    try {
        const result = await searchArticlesAndUsers(query, limit);
        // console.log(result)
        res.json(result)
        
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche' });
        console.log(error)
    }
}