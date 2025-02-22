import * as React from 'react';
import * as Redux from 'react-redux';
import { getArticles, resetAllPosts, resetAuthorPosts } from '../../../store/slice/articleSlice';
import PostsList from '../../../components/PostsList/PostsList';
import ScrollToTopButton from '../../../components/ScrollToTopButton/ScrollToTopButton';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import { NavLink, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const DashBoardAuthor = () => {
    const user = Redux.useSelector((state) => state.auth.user);
    const posts = Redux.useSelector((state) => state.articles.authorPosts.items);
    const status = Redux.useSelector((state) => state.articles.authorPosts.status);
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate();
    // const [page, setPage] = React.useState(1);
    const hasMore = Redux.useSelector((state) => state.articles.authorPosts.hasMore)
    const page = Redux.useSelector((state) => state.articles.authorPosts.page)

    // console.log(status)
    React.useEffect(() => {
        dispatch(resetAuthorPosts())
    }, [dispatch])

    React.useEffect(() => {
        dispatch(getArticles({
            userId: user.user_id,
            limit: 10,
            page,
            context: 'author'
        }))

    }, [dispatch, user.user_id, page])

    // console.log(posts)
    const center = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }

    const header = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    }

    const h2Style = {
        textAlign: 'center',
        flex: '1',
    }

    return (
        <section>

            {posts && posts.length > 0 ?
                <div style={center}>
                    <div style={header}>
                        <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                        <h2 style={h2Style}>Vos articles :</h2>
                    </div>
                    <PostsList
                        posts={posts}
                    />
                    <InfiniteScroll
                        context="author"
                        isLoading={status === 'loading'}
                        hasMore={hasMore}
                    />
                </div>
                : <div style={center}>
                    <div style={header}>
                        <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                        <h2 style={h2Style}>Aucun article</h2>
                        <NavLink to={'/article/create'}>
                            <button>Publier un article</button>
                        </NavLink>
                    </div>

                </div>
            }

            {/* <InfiniteScroll
                context="author"
                isLoading={status === 'loading'}
                hasMore={hasMore}
            /> */}
        </section>
    );
};

export default DashBoardAuthor;
