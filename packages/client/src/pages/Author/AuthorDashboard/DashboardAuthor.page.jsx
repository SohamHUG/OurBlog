import * as React from 'react';
import * as Redux from 'react-redux';
import { getArticles, resetAuthorPosts } from '../../../store/slice/articleSlice';
import PostsList from '../../../components/PostsList/PostsList';
import ScrollToTopButton from '../../../components/ScrollToTopButton/ScrollToTopButton';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';


const DashBoardAuthor = () => {
    const user = Redux.useSelector((state) => state.auth.user);
    const posts = Redux.useSelector((state) => state.articles.authorPosts.items);
    const status = Redux.useSelector((state) => state.articles.authorPosts.status);
    const dispatch = Redux.useDispatch();
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
            // limit: 10,
            // page,
            context: 'author'
        }))

    }, [dispatch, user.user_id, page])


    // console.log(hasMore)
    return (
        <>
            <h2>Vos articles :</h2>
            <PostsList
                posts={posts}
            />

            {/* <InfiniteScroll
                context="author"
                isLoading={status === 'loading'}
                hasMore={hasMore}
            /> */}
        </>
    );
};

export default DashBoardAuthor;
