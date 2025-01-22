import * as React from "react";
import * as Redux from "react-redux";
import {
    selectPosts,
    selectPostsStatus,
    selectPostsError,
    selectUsers,
    selectPhotos,
} from "../../store/selectors";
import { getPosts } from "../../store/slice/articleSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EastIcon from "@mui/icons-material/East";
import { searchUsers } from "../../store/slice/userSlice";
import { searchPhotos } from "../../store/slice/photoSlice";
import "./PostsList.scss";
import PostContentResum from "../PostContent/PostContentResum";
import { Link } from "react-router-dom";

const PostsList = ({ posts }) => {
    const dispatch = Redux.useDispatch();

    // console.log(posts)
    return (
        <div>
            {posts.map((post, index) => {
                return (
                    <div key={post.id} className="post">
                        <div className="post-head">
                            <p className="author">
                                {!post.user_picture ?
                                    <AccountCircleIcon fontSize="large" />
                                    :
                                    <img className="avatar" src={post.user_picture} alt={`Photo de profil de ${post.user_pseudo}`} />
                                }
                                {post.user_pseudo}
                            </p>
                            <h4 className="post-title">
                                {post.title.charAt(0).toUpperCase() +
                                    (post.title.length > 15
                                        ? post.title.substring(1, 12)
                                        : post.title.slice(1))}
                            </h4>
                            <p className="post-category">{post.category_name}</p>


                        </div>

                        <div className="post-body">
                            <PostContentResum content={post.content} />
                        </div>
                        <div>
                            <Link to={`article/${post.id}`}>
                                <button>
                                    <span>Voir l'article</span>
                                    <EastIcon fontSize="small" />
                                </button>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PostsList;
