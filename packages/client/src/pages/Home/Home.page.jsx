import * as React from 'react';
import * as Redux from 'react-redux';
import PostsList from "../../components/PostsList/PostsList";
import SideList from '../../components/SideList/SideList';
import CategoriesNav from '../../components/CategoriesNav/CategoriesNav';
import { selectUsersStatus, selectUsersError, selectUsers, selectPosts } from '../../store/selectors';
import { openModalLogin } from '../../store/slice/authSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import './Home.scss';
import { getArticles, setSortBy, resetAllPosts } from '../../store/slice/articleSlice';
import { useNavigate, NavLink } from 'react-router-dom';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton';
import { getPopularUsers } from '../../store/slice/userSlice';
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll';

const HomePage = () => {
    const filters = Redux.useSelector((state) => state.articles.filters)
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate()
    const status = Redux.useSelector((state) => state.articles.allPosts.status);
    const error = Redux.useSelector((state) => state.articles.allPosts.error);
    const users = Redux.useSelector(((state) => state.users.users));
    const usersStatus = Redux.useSelector(((state) => state.users.status));
    const { user } = Redux.useSelector((state) => state.auth);
    const posts = Redux.useSelector((state) => state.articles.allPosts.items);
    const hasMore = Redux.useSelector((state) => state.articles.allPosts.hasMore)
    const page = Redux.useSelector((state) => state.articles.allPosts.page)

    React.useEffect(() => {
        if (usersStatus === 'succeeded' || users.length === 0) {
            dispatch(getPopularUsers());
        }

    }, [dispatch, usersStatus, users]);

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
        dispatch(resetAllPosts({ context: "all" }));
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
                        <select value={filters.sortBy} onChange={handleSortChange}>
                            <option value="recent">Les plus récents</option>
                            <option value="famous">Les plus populaires</option>
                        </select>
                        <button onClick={handlePublishPost} className='create-article-btn'>
                            Publiez votre article !
                        </button>
                    </div>
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
