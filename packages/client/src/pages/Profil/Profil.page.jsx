import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { getProfil } from '../../store/slice/userSlice';
import { getPosts } from '../../store/slice/articleSlice';
import PostsList from '../../components/PostsList/PostsList';

const ProfilPage = () => {
    const { id } = useParams()
    const dispatch = Redux.useDispatch();
    const profil = Redux.useSelector((state) => state.users.profil);
    const posts = Redux.useSelector((state) => state.posts.authorPosts.items)

    React.useEffect(() => {
        dispatch(getProfil(id))
    }, [dispatch, id])

    React.useEffect(() => {
        if (profil && (profil.role_name === 'author' || profil.role_name === "admin")) {
            dispatch(getPosts({
                context: 'author',
                userId: profil.user_id
            }))
        }
    }, [dispatch, profil])

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

            {posts && posts.length > 0 &&

                <PostsList posts={posts} />
            }

        </section>
    );
}

export default ProfilPage;