import * as React from 'react';
import * as Redux from 'react-redux';
import PostsList from "../../components/PostsList/PostsList";
import SideList from '../../components/SideList/SideList';
import CategoriesNav from '../../components/CategoriesNav/CategoriesNav';
import { selectUsersStatus, selectUsersError, selectUsers, selectPosts } from '../../store/selectors';
import { openModalLogin } from '../../store/slice/authSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
// import PopularAuthorsList from '../../components/PopularAuthorsList/PopularAuthorsList';
import './Home.scss';
import { getPosts, setSortBy } from '../../store/slice/articleSlice';
import { useNavigate } from 'react-router-dom';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton';
import { getPopularUsers } from '../../store/slice/userSlice';

const HomePage = () => {
    const filters = Redux.useSelector((state) => state.posts.filters)
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate()
    const status = Redux.useSelector(selectUsersStatus);
    const error = Redux.useSelector(selectUsersError);
    const users = Redux.useSelector(selectUsers);
    const { user } = Redux.useSelector((state) => state.users);
    const posts = Redux.useSelector(selectPosts);

    React.useEffect(() => {
        dispatch(getPopularUsers());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(getPosts({ sortBy: filters.sortBy }));
    }, [filters.sortBy, dispatch]);

    const handleSortChange = (event) => {
        const sortBy = event.target.value;
        dispatch(setSortBy(sortBy));
    };

    const handlePublishPost = () => {
        if (!user) {
            dispatch(openModalLogin())
        } else if (user && user.role_name !== 'author') {
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
                        status={status}
                        error={error}
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
                                <p>{user.pseudo}</p>
                            </div>
                        )}
                    />

                </div>

                <ScrollToTopButton />
            </div>
        </section>
    );
};

export default HomePage;
