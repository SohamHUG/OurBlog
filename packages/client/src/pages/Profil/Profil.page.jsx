import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { getProfil, resetProfil } from '../../store/slice/userSlice';
import { getArticles, resetAuthorPosts } from '../../store/slice/articleSlice';
import PostsList from '../../components/PostsList/PostsList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import './ProfilPage.scss'
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll';

const ProfilPage = () => {
    const { id } = useParams()
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate()
    const profil = Redux.useSelector((state) => state.users.profil);
    const status = Redux.useSelector((state) => state.users.status);
    const posts = Redux.useSelector((state) => state.articles.authorPosts.items)
    const postsStatus = Redux.useSelector((state) => state.articles.authorPosts.status)
    const hasMore = Redux.useSelector((state) => state.articles.authorPosts.hasMore)
    const page = Redux.useSelector((state) => state.articles.authorPosts.page)

    React.useEffect(() => {
        dispatch(resetProfil())
        dispatch(getProfil(id))
        dispatch(resetAuthorPosts());
    }, [dispatch, id])

    React.useEffect(() => {
        // if (profil && profil.user_id) {
            dispatch(getArticles({
                context: 'author',
                userId: id,
                limit: 10,
                page
            }));
        // }
    }, [dispatch, profil, page]);


    return (
        <section className='profil-page'>
            {profil &&
                <div className='profil-header'>
                    <ArrowBackIcon
                        onClick={() => navigate(-1)}
                        className='back-btn link'
                        fontSize="large"
                    />
                    <div className='profil-infos'>
                        {profil.profil_picture ?
                            <img className='avatar' src={profil.profil_picture} alt={`Photo de profil de ${profil.pseudo}`} />
                            : <AccountCircleIcon className='default-avatar' fontSize="large" />

                        }
                        {profil.first_name && profil.last_name ?
                            <h2>{profil.first_name} {profil.last_name}</h2>
                            : <h2>{profil.pseudo}</h2>
                        }
                    </div>
                </div>
            }

            {posts && posts.length > 0 ?
                <div>
                    <PostsList posts={posts} />
                    <InfiniteScroll context="author" isLoading={postsStatus === 'loading'} hasMore={hasMore} />
                </div>
                : <h3>Aucun contenu publié</h3>
            }

        </section>
    );
}

export default ProfilPage;