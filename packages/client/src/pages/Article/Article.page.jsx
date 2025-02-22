import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import { getArticle } from '../../store/slice/articleSlice';
import PostContent from '../../components/PostContent/PostContent';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Article.scss'
import { createComment, getComments } from '../../store/slice/commentSlice';
import CommentsList from '../../components/CommentsList/CommentsList';
import EastIcon from "@mui/icons-material/East";

const ArticlePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    const { post, status } = useSelector((state) => state.articles)
    const { user } = useSelector((state) => state.auth);
    const { comments } = useSelector((state) => state.comments)
    const statusComments = useSelector((state) => state.comments.status)
    const errorComments = useSelector((state) => state.comments.error)
    const [comment, setComment] = React.useState('')

    React.useEffect(() => {
        dispatch(getArticle(id));
    }, [id, dispatch]);

    React.useEffect(() => {
        if (post) {
            dispatch(getComments({ articleId: post.id }))
        }
    }, [post]);

    // console.log(location)

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(createComment({ comment: comment, id: post.id })).unwrap();
            setComment('')
        } catch (error) {
            console.error(error.message)
        }

    }

    // console.log(post.content)

    return (
        <>
            {status === 'loading' &&
                <div>Loading</div>
            }

            {status === 'failed' &&
                <div className='alert'>Post introuvable </div>
            }

            {status === 'succeeded' && post &&
                <section className='article-page'>
                    <div className='post-head'>
                        <ArrowBackIcon
                            onClick={() => navigate(-1)}
                            className='back-btn link'
                            fontSize="large"
                        />
                        <h1 className='post-title'>{post.title}</h1>
                        <NavLink className="author link"
                            to={user && user.role_name === 'admin' ?
                                `/admin/user/${post.user_id}`
                                : `/profil/${post.user_id}`
                            }
                        >
                            {!post.user_picture ?
                                <AccountCircleIcon className='default-avatar' fontSize="large" />
                                :
                                <img className="avatar" src={post.user_picture} alt={`Photo de profil de ${post.user_pseudo}`} />
                            }
                            {post.user_pseudo}
                        </NavLink>
                        <NavLink to={`/category/${post.category_id}`} className="post-category link">
                            {post.category_name}
                        </NavLink>
                    </div>

                    <PostContent
                        content={post.content}
                    />
                    {user && (user.user_id === post.user_id || user.role_name === 'admin') && (
                        <div className='update-action'>
                            <NavLink className="update-link" to={`/articles/update/${post.id}`}>
                                <button>
                                    <span>Modifier</span>
                                    <EastIcon fontSize="small" />
                                </button>
                            </NavLink>
                        </div>
                    )}

                    <div className='comments-container'>
                        <h3>Commentaires :</h3>
                        {errorComments && <p className='alert'>{errorComments}</p>}
                        {user && user.is_verified === 1 &&
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="comment">Ajouter un commentaire :</label>
                                <textarea
                                    id='comment'
                                    name='comment'
                                    autoComplete='off'
                                    type="text"
                                    placeholder='...'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
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