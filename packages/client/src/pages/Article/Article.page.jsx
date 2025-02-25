import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link, NavLink, useLocation, Navigate } from 'react-router-dom';
import { getArticle } from '../../store/slice/articleSlice';
import PostContent from '../../components/PostContent/PostContent';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Article.scss'
import { createComment, getComments } from '../../store/slice/commentSlice';
import CommentsList from '../../components/CommentsList/CommentsList';
import EastIcon from "@mui/icons-material/East";
import { openModalLogin } from '../../store/slice/authSlice';
import { selectArticle, selectArticleStatus, selectComments, selectCommentsError, selectCommentsStatus, selectUser } from '../../store/selectors';

const ArticlePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    const article = useSelector(selectArticle)
    const status = useSelector(selectArticleStatus)
    const user = useSelector(selectUser);
    const comments = useSelector(selectComments)
    const statusComments = useSelector(selectCommentsStatus)
    const errorComments = useSelector(selectCommentsError)
    const [comment, setComment] = React.useState('')

    React.useEffect(() => {
        dispatch(getArticle(id));
    }, [id, dispatch]);

    React.useEffect(() => {
        if (article) {
            dispatch(getComments({ articleId: article.id }))
        }
    }, [article, dispatch]);

    const handleCommentChange = async (e) => {
        e.preventDefault();

        setComment(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(createComment({ comment: comment, id: article.id })).unwrap();
            setComment('')
        } catch (error) {
            console.error(error.message)
        }

    }

    const handlePublishComment = () => {
        dispatch(openModalLogin())
    }


    return (
        <>
            {status === 'loading' &&
                <div>Loading</div>
            }

            {status === 'failed' &&
                <Navigate to={'/nope'} />
            }

            {status === 'succeeded' && article &&
                <section className='article-page'>
                    <div className='post-head'>
                        <ArrowBackIcon
                            onClick={() => navigate(-1)}
                            className='back-btn link'
                            fontSize="large"
                        />
                        <h1 className='post-title'>{article.title}</h1>
                        <NavLink className="author link"
                            to={user && user.role_name === 'admin' ?
                                `/admin/user/${article.user_id}`
                                : `/profil/${article.user_id}`
                            }
                        >
                            {!article.user_picture ?
                                <AccountCircleIcon className='default-avatar' fontSize="large" />
                                :
                                <img className="avatar" src={article.user_picture} alt={`Photo de profil de ${article.user_pseudo}`} />
                            }
                            {article.user_pseudo}
                        </NavLink>
                        <NavLink to={`/category/${article.category_id}`} className="post-category link">
                            {article.category_name}
                        </NavLink>
                    </div>

                    <PostContent
                        content={article.content}
                    />
                    {user && (user.user_id === article.user_id || user.role_name === 'admin') && (
                        <div className='update-action'>
                            <NavLink className="update-link" to={`/articles/update/${article.id}`}>
                                <button>
                                    <span>Modifier</span>
                                    <EastIcon fontSize="small" />
                                </button>
                            </NavLink>
                        </div>
                    )}

                    <div className='comments-container'>
                        <div>
                            <h3>Commentaires :</h3>
                            {!user &&
                                <button onClick={handlePublishComment}>Publier un commentaire</button>
                            }
                        </div>
                        {errorComments && <p className='alert'>{errorComments}</p>}
                        {user &&
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="comment">Ajouter un commentaire :</label>
                                <textarea
                                    id='comment'
                                    name='comment'
                                    autoComplete='off'
                                    type="text"
                                    placeholder='...'
                                    value={comment}
                                    onChange={handleCommentChange}
                                    required
                                />
                                <button type='submit'>
                                    Publier
                                </button>
                            </form>
                        }

                        {comments && comments.length > 0 &&
                            <CommentsList comments={comments} />
                        }
                    </div>
                </section>
            }
        </>
    );
};

export default ArticlePage;