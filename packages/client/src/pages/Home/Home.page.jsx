import * as React from 'react';
import * as Redux from 'react-redux';
import PostsList from "../../components/PostsList/PostsList";
import SideList from '../../components/SideList/SideList';
import CategoriesNav from '../../components/CategoriesNav/CategoriesNav';
// import { selectUsersStatus, selectUsersError, selectUsers, selectPosts } from '../../store/selectors';
import { openModalLogin } from '../../store/slice/authSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import './Home.scss';
import { getArticles, setSortBy, resetArticles } from '../../store/slice/articleSlice';
import { useNavigate, NavLink } from 'react-router-dom';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton';
import { getPopularUsers, resetUsers } from '../../store/slice/userSlice';
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll';
import { selectAllArticles, selectAllArticlesError, selectAllArticlesHasMore, selectAllArticlesPage, selectAllArticlesStatus, selectFilters, selectUser, selectUsersList, selectUsersStatus } from '../../store/selectors';

const HomePage = () => {
    const filters = Redux.useSelector(selectFilters)
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate()
    const status = Redux.useSelector(selectAllArticlesStatus);
    const error = Redux.useSelector(selectAllArticlesError);
    const users = Redux.useSelector(selectUsersList);
    const usersStatus = Redux.useSelector(selectUsersStatus);
    const user = Redux.useSelector(selectUser);
    const posts = Redux.useSelector(selectAllArticles);
    const hasMore = Redux.useSelector(selectAllArticlesHasMore)
    const page = Redux.useSelector(selectAllArticlesPage)

    React.useEffect(() => {
        if (usersStatus === 'succeeded' || users.length === 0) {
            dispatch(resetUsers())
            // dispatch(resetArticles({context: 'all'}));
            dispatch(getPopularUsers());
        }

    }, [dispatch]);

    // console.log(posts)

    React.useEffect(() => {
        dispatch(getArticles({
            sortBy: filters.sortBy,
            page,
            limit: 10,
            context: 'all'
        }));
    }, [filters.sortBy, page, dispatch]);

    const handleSortChange = (event) => {
        const sortBy = event.target.value;
        dispatch(setSortBy(sortBy));
        dispatch(resetArticles({ context: 'all' }));

    };

    const handlePublishPost = () => {
        if (!user) {
            dispatch(openModalLogin())
        } else if (user && user.role_name !== 'author' && user.role_name !== 'admin') {
            navigate('/profil')
        } else {
            navigate('/article/create')
        }
    }

    return (
        <section className='home-page'>
            <CategoriesNav />
            <div className="home-page-content">

                <div className='left'>
                    <div className="filter-articles-home">
                        <h3>
                            {filters.sortBy === 'recent' ? 'Les derniers articles' : 'Les articles tendances'}
                        </h3>
                        <select name='sortBy' value={filters.sortBy} onChange={handleSortChange}>
                            <option value="recent">Les plus récents</option>
                            <option value="famous">Les plus populaires</option>
                        </select>
                        <button onClick={handlePublishPost} className='create-article-btn'>
                            Publiez votre article !
                        </button>
                    </div>
                    {/* {error && <p className='alert'>{error}</p>} */}
                    <PostsList
                        posts={posts}
                    />
                </div>

                <div className='right'>
                    {usersStatus === 'idle' &&
                        <SideList
                            items={users}
                            title={'RÉDACTEURS POPULAIRES'}
                            limit={5}
                            seeMoreType={'expand'}
                            renderItem={(author) => (
                                <NavLink className='popular-authors'
                                    to={user && user.role_name === 'admin' ?
                                        `/admin/user/${author.id}`
                                        : `/profil/${author.id}`
                                    }
                                >
                                    {!author.profil_picture ?
                                        <AccountCircleIcon className='default-avatar' fontSize="large" />
                                        :
                                        <img className="avatar" src={author.profil_picture} alt={`Photo de profil de ${author.user_pseudo}`} />
                                    }
                                    <p className='author-pseudo'>{author.first_name} {author.last_name} </p>
                                </NavLink>
                            )}
                        />
                    }


                </div>
            </div>
            <InfiniteScroll
                context="all"
                isLoading={status === 'loading'}
                hasMore={hasMore}
            />

        </section>
    );
};

export default HomePage;
