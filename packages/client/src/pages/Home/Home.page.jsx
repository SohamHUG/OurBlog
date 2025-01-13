import * as React from 'react';
import * as Redux from 'react-redux';
import PostsList from "../../components/PostsList/PostsList";
import SideList from '../../components/SideList/SideList';
import CategoriesNav from '../../components/CategoriesNav/CategoriesNav';
import { selectUsersStatus, selectUsersError, selectUsers, } from '../../store/selectors';
import { searchUsers, } from '../../store/slice/userSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
// import PopularAuthorsList from '../../components/PopularAuthorsList/PopularAuthorsList';
import './Home.scss';

const HomePage = () => {
    const [filter, setFilter] = React.useState('recent');
    const dispatch = Redux.useDispatch();
    const status = Redux.useSelector(selectUsersStatus);
    const error = Redux.useSelector(selectUsersError);
    const users = Redux.useSelector(selectUsers);
    const [showToTop, setShowToTop] = React.useState(false);

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(searchUsers());
        }

        const handleScroll = () => {
            setShowToTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [status, dispatch, showToTop]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };


    return (
        <section className='home-page'>
            <CategoriesNav />
            <div className="home-page-content">

                <div className='left'>
                    {/* Filtre à mettre en component */}
                    <div className="filter-articles-home">
                        <h3>
                            {filter === 'recent' ? 'Les derniers articles' : 'Les articles tendances'}
                        </h3>
                        <select onChange={handleFilterChange} value={filter}>
                            <option value="recent">Les plus récents</option>
                            <option value="famous">Les plus populaires</option>
                        </select>
                        <button className='create-article-btn'>
                            Publiez votre article !
                        </button>
                    </div>
                    <PostsList />
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
                                <AccountCircleIcon fontSize='large' />
                                {user.name}
                            </div>
                        )}
                    // content={<PopularAuthorsList/>}
                    />

                </div>
                {showToTop &&
                    <button className='to-top-btn' onClick={scrollToTop}>
                        <KeyboardArrowUpRoundedIcon fontSize='medium' />
                    </button>
                }
            </div>
        </section>
    );
};

export default HomePage;
