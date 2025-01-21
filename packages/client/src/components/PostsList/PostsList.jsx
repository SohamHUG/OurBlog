import * as React from "react";
import * as Redux from "react-redux";
import {
    selectPosts,
    selectPostsStatus,
    selectPostsError,
    selectUsers,
    selectPhotos,
} from "../../store/selectors";
import { fetchPosts, incrementPage } from "../../store/slice/articleSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EastIcon from "@mui/icons-material/East";
import { searchUsers } from "../../store/slice/userSlice";
import { searchPhotos } from "../../store/slice/photoSlice";
import "./PostsList.scss";

const PostsList = () => {
    const dispatch = Redux.useDispatch();
    const posts = Redux.useSelector(selectPosts);
    const status = Redux.useSelector(selectPostsStatus);
    const error = Redux.useSelector(selectPostsError);
    const { page, loading, hasMore } = Redux.useSelector(
        (state) => state.posts
    );
    const users = Redux.useSelector(selectUsers);
    const photos = Redux.useSelector(selectPhotos);
    const observerRef = React.useRef();

    // console.log(status, loading, page, hasMore);
    // console.log(posts);
    React.useEffect(() => {
        // if (!loading) {
        // à améliorer
        // console.log("on charge");
        dispatch(fetchPosts(page));
        // dispatch(searchUsers());
        dispatch(searchPhotos());
        // }
    }, [dispatch, page, loading]);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && status != "first") {
                    // console.log("Observer déclenché");
                    dispatch(incrementPage());
                }
            },
            { threshold: 0.5 }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [dispatch, loading]);

    const getAuthorName = (userId) => {
        if (!users || users.length === 0) return "Unknown Author";
        const user = users.find((user) => user.id === userId);
        return user ? user.name : "Unknown Author";
    };

    return (
        <div>
            {status === "loading" && posts.length === 0 && (
                <div>Loading...</div>
            )}
            {status === "failed" && <div>{error}</div>}

            {posts.map((post, index) => {
                const photo = photos.find((photo) => photo.id === post.id);
                return (
                    <div key={post.id} className="post">
                        <div className="post-head">
                            <p className="author">
                                <AccountCircleIcon fontSize="large" />
                                {getAuthorName(post.userId)}
                            </p>
                            <h4 className="post-title">
                                {post.title.charAt(0).toUpperCase() +
                                    (post.title.length > 15
                                        ? post.title.substring(1, 12)
                                        : post.title.slice(1))}
                            </h4>
                            <p className="post-category">Category</p>
                        </div>

                        <div className="post-body">
                            {photo && (
                                <img
                                    src={photo.thumbnailUrl}
                                    alt={`Thumbnail for ${post.title}`}
                                />
                            )}
                            <p>
                                {post.body.charAt(0).toUpperCase() +
                                    post.body.slice(1)}
                                <span>
                                    <button>
                                        <span>Voir l'article complet</span>
                                        <EastIcon fontSize="small" />
                                    </button>
                                </span>
                            </p>
                        </div>
                    </div>
                );
            })}
            <div
                ref={observerRef}
                style={{
                    height: "5px",
                    background: "transparent",
                }}
            />
        </div>
    );
};

export default PostsList;
