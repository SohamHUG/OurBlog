import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost } from '../../store/slice/articleSlice';
import PostContent from '../../components/PostContent/PostContent';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './Article.scss'

const Article = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { post, statusPost, errorPost } = useSelector((state) => state.posts)

    React.useEffect(() => {

        dispatch(getPost(id))

    }, [id, dispatch]);

    return (
        <>
            {statusPost === 'loading' &&
                <div>Loading</div>
            }

            {statusPost === 'failed' &&
                <div className='alert'>Post introuvable </div>
            }

            {statusPost === 'succeeded' &&
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
                            <form action="">
                                <label htmlFor="">Ajouter un commentaire</label>
                                <input type="text" placeholder='...' />
                            </form>
                    </div>
                </section>
            }
        </>
    );
};

export default Article;