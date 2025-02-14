import React, { useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PostContentResum from '../../components/PostContent/PostContentResum';
import './SearchResultsPage.scss';

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

    if (results.length === 0) {
        return <div className="no-results">Aucun résultat trouvé pour <strong>"{query}"</strong>.</div>;
    }

    return (
        <section className="search-results-page">
            <h1>Résultats :</h1>
            <div className="results-grid">
                {results.map((result) => (
                    <NavLink
                        key={result.id + Math.random()}
                        className="result-card"
                        to={result.type === 'article' ?
                            `/article/${result.id}`
                            : `/profil/${result.id}`
                        }
                    >
                        {result.type === 'user' && (
                            <div className="user-card">
                                {result.picture ? (
                                    <img className="avatar" src={result.picture} alt={result.name} />
                                ) : (
                                    <AccountCircleIcon className="avatar-icon" fontSize="large" />
                                )}
                                <div className="user-info">
                                    <h3>{result.name}</h3>
                                    <p className="description">{result.description}</p>
                                    {/* <div className="view-button">Voir le profil</div> */}
                                </div>
                            </div>
                        )}
                        {result.type === 'article' && (
                            <div className="article-card">
                                <h3>{result.name}</h3>
                                <PostContentResum content={result.description} />
                                {/* <div className="view-button">Voir l'article</div> */}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </section>
    );
};

export default SearchResultsPage;
