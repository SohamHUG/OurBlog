import * as React from 'react';
import * as Redux from 'react-redux';
import { getPosts } from '../../../store/slice/articleSlice';
import PostsList from '../../../components/PostsList/PostsList';


const DashBoardAuthor = () => {

    const user = Redux.useSelector((state) => state.users.user);
    const { posts, status } = Redux.useSelector((state) => state.posts);
    const dispatch = Redux.useDispatch();

    // console.log(status)
    React.useEffect(() => {

        dispatch(getPosts({ userId: user.user_id }))

    }, [dispatch, user.user_id])

    // console.log(posts)
    return (
        <>
            <h2>Vos articles :</h2>
            <PostsList
                posts={posts}
            />
        </>
    );
};

export default DashBoardAuthor;
