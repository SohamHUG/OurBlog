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
import { getPosts, setSortBy, resetAllPosts } from '../../store/slice/articleSlice';
import { useNavigate } from 'react-router-dom';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton';
import { getPopularUsers } from '../../store/slice/userSlice';
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll';

const HomePage = () => {
    const filters = Redux.useSelector((state) => state.posts.filters)
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate()
    const status = Redux.useSelector((state) => state.posts.allPosts.status);
    const error = Redux.useSelector((state) => state.posts.allPosts.error);
    const users = Redux.useSelector(selectUsers);
    const { user } = Redux.useSelector((state) => state.users);
    const posts = Redux.useSelector((state) => state.posts.allPosts.items);
    // const [page, setPage] = React.useState(1);
    const hasMore = Redux.useSelector((state) => state.posts.allPosts.hasMore)
    const page = Redux.useSelector((state) => state.posts.allPosts.page)

    // console.log(page)

    // console.log(posts)

    React.useEffect(() => {
        dispatch(getPopularUsers());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(getPosts({
            sortBy: filters.sortBy,
            page,
            limit: 10,
            context: 'all'
        }));
    }, [filters.sortBy, page, dispatch]);

    // const loadMorePosts = () => {
    //     if (status !== 'loading' && hasMore) {
    //         setPage((prevPage) => prevPage + 1);
    //     }
    // };

    const handleSortChange = (event) => {
        const sortBy = event.target.value;
        dispatch(setSortBy(sortBy));
        // setPage(1);
        dispatch(resetAllPosts({context: "all"}));
    };

    // React.useEffect(() => {
    //     setPage(1);
    //     dispatch(resetAllPosts());
    // }, [filters.sortBy, dispatch]);

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
                    <SideList
                        items={users}
                        title={'RÉDACTEURS POPULAIRES'}
                        limit={5}
                        seeMoreType={'expand'}
                        renderItem={(user) => (
                            <div className='popular-authors'>
                                {!user.profil_picture ?
                                    <AccountCircleIcon className='default-avatar' fontSize="large" />
                                    :
                                    <img className="avatar" src={user.profil_picture} alt={`Photo de profil de ${user.user_pseudo}`} />
                                }
                                <p className='author-pseudo'>{user.pseudo}</p>
                            </div>
                        )}
                    />

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
