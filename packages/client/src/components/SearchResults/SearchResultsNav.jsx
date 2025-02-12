import { NavLink } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import './SearchResultsNav.scss'

const SearchResultsNav = ({ results, searchRef, clearSearch }) => {
    // const isFocused = searchRef.current === document.activeElement;
    // if (isFocused && results.length === 0) {
    //     return null;
    // }

    if (results.length === 0) return null;


    return (
        <div className="search-results-container" ref={searchRef}>
            <ul className="search-results-list">
                {results.map((result) => (
                    <NavLink
                        to={result.type === "article" ? `/article/${result.id}` : `/profil/${result.id}`}

                        className="search-result-item"
                        onClick={clearSearch}
                        key={result.id + Math.random()}
                    >
                        <li className="search-result-link">

                            {result.type === "user" && (
                                result.picture ?
                                    <img className="avatar" src={result.picture} alt={result.name} />
                                    : <AccountCircleIcon className='avatar' fontSize="large" />
                            )}
                            <span className="result-name">
                                {result.name} {result.type === 'user' && <small>{result.description}</small>}
                            </span>

                        </li> </NavLink>
                ))}
            </ul>
        </div>
    );
};

export default SearchResultsNav;