import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost } from '../../store/slice/articleSlice';
import PostContent from '../../components/PostContent/PostContent';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './Article.scss'
import { createComment, getComments } from '../../store/slice/commentSlice';

const Article = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { post, status } = useSelector((state) => state.posts)
    const { user } = useSelector((state) => state.users);
    const { comments } = useSelector((state) => state.comments)
    const statusComments = useSelector((state) => state.comments.status)
    const [comment, setComment] = React.useState('')

    React.useEffect(() => {
        dispatch(getPost(id));
    }, [id, dispatch]);

    React.useEffect(() => {
        if (statusComments === 'idle' && post) {
            dispatch(getComments({ articleId: post.id }))
        }
    }, [statusComments, post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newComm = await dispatch(createComment({ comment: comment, id: post.id }));
        if (createComment.fulfilled.match(newComm)) {
            setComment('')
        }

    }

    // console.log(comments)

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
                        <p className="author">
                            {!post.user_picture ?
                                <AccountCircleIcon className='default-avatar' fontSize="large" />
                                :
                                <img className="avatar" src={post.user_picture} alt={`Photo de profil de ${post.user_pseudo}`} />
                            }
                            {post.user_pseudo}
                        </p>
                        <Link to={`../../category/${post.category_id}`} className="post-category link">
                            {post.category_name}
                        </Link>
                    </div>

                    <PostContent
                        content={post.content}
                    />

                    <div className='comments-container'>
                        <h3>Commentaires :</h3>

                        {user && user.is_verified === 1 &&
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="comment">Ajouter un commentaire</label>
                                <input
                                    id='comment'
                                    name='comment'
                                    type="text"
                                    placeholder='...'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                            </form>
                        }

                        {statusComments === "succeeded" &&
                            comments.map((comm) => {
                                return (
                                    <div key={comm.id}>
                                        <div>
                                            {!comm.user_picture ?
                                                <AccountCircleIcon className='default-avatar' fontSize="large" />
                                                :
                                                <img className="avatar" src={comm.user_picture} alt={`Photo de profil de ${comm.user_pseudo}`} />
                                            }
                                            {comm.user_pseudo}
                                        </div>
                                        <p>{comm.content}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>
            }
        </>
    );
};

export default Article;