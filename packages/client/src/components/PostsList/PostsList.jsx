import * as React from "react";
import * as Redux from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EastIcon from "@mui/icons-material/East";
import "./PostsList.scss";
import PostContentResum from "../PostContent/PostContentResum";
import { NavLink, useLocation } from "react-router-dom";
import { deleteArticle } from "../../store/slice/articleSlice";
import Modal from "../Modal/Modal";

const PostsList = ({ posts }) => {
    const location = useLocation();
    const user = Redux.useSelector((state) => state.auth.user);
    const dispatch = Redux.useDispatch();
    
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const [articleToDelete, setArticleToDelete] = React.useState(null); 

    const toggleModalConfirm = (id) => {
        setArticleToDelete(id);
        setOpenModalConfirm(true);
    };

    const closeModalConfirm = () => {
        setArticleToDelete(null);
        setOpenModalConfirm(false);
    };

    const confirmDeleteArticle = () => {
        if (articleToDelete) {
            dispatch(deleteArticle(articleToDelete));
            closeModalConfirm();
        }
    };

    return (
        <div className="posts-list-container">
            {posts.map((post) => (
                <div key={post.id} className="post">
                    <div className="post-head">
                        <p className="author">
                            {!post.user_picture ? (
                                <AccountCircleIcon className='default-avatar' fontSize="large" />
                            ) : (
                                <img className="avatar" src={post.user_picture} alt={`Photo de profil de ${post.user_pseudo}`} />
                            )}
                            <span>{post.user_pseudo}</span>
                        </p>
                        <h4 className="post-title">
                            {post.title.charAt(0).toUpperCase() + post.title.slice(1)}
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

                    {user && (user.user_id === post.user_id || user.role_name === 'admin') && (
                        <>
                            <NavLink className="article-link" to={`/articles/update/${post.id}`}>
                                <button>
                                    <span>Modifier</span>
                                    <EastIcon fontSize="small" />
                                </button>
                            </NavLink>
                            <button onClick={() => toggleModalConfirm(post.id)}> 
                                <span>Supprimer</span>
                            </button>
                        </>
                    )}
                </div>
            ))}

            {openModalConfirm && (
                <Modal
                    title="Êtes-vous sûr ?"
                    content={
                        <div>
                            <p>
                                Voulez-vous vraiment <strong style={{ color: 'red' }}>supprimer</strong> cet article de manière <strong style={{ color: 'red' }}>définitive</strong> ?
                            </p>
                            <strong style={{ color: 'red' }}>Cette action est irréversible !</strong>
                        </div>
                    }
                    validButton='Oui, je suis sûr'
                    cancelButton='Annuler'
                    open={openModalConfirm}
                    cancel={closeModalConfirm}
                    valid={confirmDeleteArticle}
                />
            )}
        </div>
    );
};

export default PostsList;
