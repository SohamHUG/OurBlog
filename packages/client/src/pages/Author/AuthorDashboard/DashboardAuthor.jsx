import * as React from 'react';
import * as Redux from 'react-redux';
import { getPosts } from '../../../store/slice/articleSlice';
import PostsList from '../../../components/PostsList/PostsList';
import ScrollToTopButton from '../../../components/ScrollToTopButton/ScrollToTopButton';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';


const DashBoardAuthor = () => {

    const user = Redux.useSelector((state) => state.users.user);
    const posts = Redux.useSelector((state) => state.posts.authorPosts.items);
    const status = Redux.useSelector((state) => state.posts.authorPosts.status);
    const dispatch = Redux.useDispatch();
    const [page, setPage] = React.useState(1);
    const hasMore = Redux.useSelector((state) => state.posts.authorPosts.hasMore)

    // console.log(status)
    React.useEffect(() => {

        dispatch(getPosts({
            userId: user.user_id,
            limit: 10,
            page,
            context: 'author'
        }))

    }, [dispatch, user.user_id, page])

    const loadMorePosts = () => {
        if (status !== 'loading' && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    // console.log(hasMore)
    return (
        <>
            <h2>Vos articles :</h2>
            <PostsList
                posts={posts}
            />

            <InfiniteScroll
                onLoadMore={loadMorePosts}
                isLoading={status === 'loading'}
                hasMore={hasMore}
            />
        </>
    );
};

export default DashBoardAuthor;
