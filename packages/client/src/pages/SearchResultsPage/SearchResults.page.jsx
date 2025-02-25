import React, { useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PostContentResum from '../../components/PostContent/PostContentResum';
import './SearchResultsPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchResults } from '../../store/slice/searchSlice';
import { selectResults, selectUser } from '../../store/selectors';

const SearchResultsPage = () => {
    const location = useLocation();
    const results = useSelector(selectResults)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        if (query) {
            dispatch(fetchSearchResults({ query }))
        }
    }, [query, dispatch]);



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
                        to={
                            result.type === 'article' ?
                                `/article/${result.id}`
                                : user && user.role_name === 'admin' ?
                                    `/admin/user/${result.id}`
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
                        {result.type === 'category' && (
                            <div className="category-card">
                                <h3 className='link'>{result.type}</h3>
                                <p>{result.name}</p>
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </section>
    );
};

export default SearchResultsPage;
