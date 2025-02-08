import * as React from "react";
import * as Redux from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EastIcon from "@mui/icons-material/East";
import "./PostsList.scss";
import PostContentResum from "../PostContent/PostContentResum";
import { NavLink, useLocation } from "react-router-dom";
import { deleteArticle } from "../../store/slice/articleSlice";

const PostsList = ({ posts }) => {
    const location = useLocation();
    const user = Redux.useSelector((state) => state.users.user);
    const dispatch = Redux.useDispatch()

    // console.log(location)

    // console.log(posts)
    
    const handleRemoveArticle = (id) => {
        dispatch(deleteArticle(id))
    }

    return (
        <div className="posts-list-container">
            {posts.map((post, index) => {
                return (
                    <div key={post.id} className="post">
                        <div className="post-head">
                            <p className="author">
                                {!post.user_picture ?
                                    <AccountCircleIcon className='default-avatar' fontSize="large" />
                                    :
                                    <img className="avatar" src={post.user_picture} alt={`Photo de profil de ${post.user_pseudo}`} />
                                }
                                {post.user_pseudo}
                            </p>
                            <h4 className="post-title">
                                {post.title.charAt(0).toUpperCase() + post.title.slice(1)
                                    // (post.title.length > 20
                                    //     ? post.title.substring(1, 20)
                                    //     :
                                    //     post.title.slice(1))
                                }
                            </h4>
                            <NavLink to={`/category/${post.category_id}`} className="post-category link">
                                {post.category_name}
                            </NavLink>


                        </div>

                        <div className="post-body">
                            <PostContentResum content={post.content} />
                        </div>


                        <NavLink className="article-link" to={`/article/${post.id}`}>
                            <button>
                                <span>Voir l'article</span>
                                <EastIcon fontSize="small" />
                            </button>
                        </NavLink>
                        {user && (user.user_id === post.user_id || user.role_name === 'admin') &&
                            <>
                                <NavLink className="article-link" to={`/articles/update/${post.id}`}>
                                    <button>
                                        <span>Modifier</span>
                                        <EastIcon fontSize="small" />
                                    </button>
                                </NavLink>
                                <button onClick={() => handleRemoveArticle(post.id)}>
                                    <span>Supprimer</span>
                                </button>
                            </>
                        }

                    </div>
                );
            })}
        </div>
    );
};

export default PostsList;
