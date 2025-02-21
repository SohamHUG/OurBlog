import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { getProfil } from '../../store/slice/userSlice';
import { getArticles, resetAuthorPosts } from '../../store/slice/articleSlice';
import PostsList from '../../components/PostsList/PostsList';

const ProfilPage = () => {
    const { id } = useParams()
    const dispatch = Redux.useDispatch();
    const profil = Redux.useSelector((state) => state.users.profil);
    const status = Redux.useSelector((state) => state.users.status);
    const posts = Redux.useSelector((state) => state.articles.authorPosts.items)

    React.useEffect(() => {
        dispatch(getProfil(id))
    }, [dispatch, id])

    React.useEffect(() => {
        if (profil?.user_id) {
            dispatch(resetAuthorPosts());
            dispatch(getArticles({
                context: 'author',
                userId: profil.user_id,
            }));
        }
    }, [dispatch, profil?.user_id]);

    console.log(profil)

    return (
        <section>
            {profil &&
                <div>
                    {profil.profil_picture &&
                        <img className='avatar' src={profil.profil_picture} alt={`Photo de profil de ${profil.pseudo}`} />
                    }
                    <p>{profil.first_name}</p>

                </div>
            }

            {posts && posts.length > 0 ?
                <PostsList posts={posts} />
                : <h3>Aucun contenu publié</h3>
            }

        </section>
    );
}

export default ProfilPage;