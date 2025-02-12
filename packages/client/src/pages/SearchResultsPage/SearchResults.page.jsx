import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PostContentResum from "../../components/PostContent/PostContentResum";

const SearchResultsPage = () => {
    const location = useLocation();
    const [results, setResults] = useState([]);

    const fetchResults = async (query) => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Erreur lors de la recherche');
            }
            const results = await response.json();
            setResults(results);
        } catch (err) {
            console.error('Erreur :', err);
        }
    };

    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        if (query) {
            fetchResults(query);
        }
    }, [query]);

    if (results && results.length === 0) {
        return <div>Aucun résultats</div>;
    }

    return (
        <section>
            {results.map((result) => (
                <div key={result.id + Math.random()}>
                    {result.type === 'user' &&
                        <p>{result.name}</p>
                    }
                    {result.type === 'article' &&
                        <PostContentResum content={result.description} />
                    }
                </div>
            ))}
        </section>
    );
};

export default SearchResultsPage;