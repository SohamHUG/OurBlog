import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { deleteProfilPic } from '../../../store/slice/photoSlice';
import Modal from '../../../components/Modal/Modal';
import UserForm from '../../../components/UserForm/UserForm';
import { getProfil, updateUser, deleteUser } from '../../../store/slice/userSlice';
import { getArticles } from '../../../store/slice/articleSlice';
import { getComments } from '../../../store/slice/commentSlice';
import CommentsList from '../../../components/CommentsList/CommentsList'
import PostsLists from '../../../components/PostsList/PostsList'

const UserPageAdmin = () => {
    const user = Redux.useSelector((state) => state.users.profil);
    const { id } = useParams()

    const dispatch = Redux.useDispatch();
    const navigate = useNavigate();
    const [openModalInfo, setOpenModalInfo] = React.useState(false);
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const { status, error } = Redux.useSelector((state) => state.users);
    const statusPhoto = Redux.useSelector((state) => state.photos.status)
    const posts = Redux.useSelector((state) => state.articles.authorPosts.items)
    const comments = Redux.useSelector((state) => state.comments.comments)

    React.useEffect(() => {
        dispatch(getProfil(id))
    }, [dispatch, id])

    // console.log(user)

    const [formUser, setFormUser] = React.useState({
        firstName: '',
        lastName: '',
        pseudo: '',
        email: '',
        newEmail: '',
    });

    React.useEffect(() => {
        if (user) {
            setFormUser({
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                pseudo: user.pseudo,
                email: user.email,
                role: user.role_id,
                newEmail: '',
            })
            dispatch(getArticles({
                context: 'author',
                userId: user.user_id
            }))
            dispatch(getComments({
                userId: user.user_id
            }))
        }

    }, [setFormUser, user, dispatch])

    const handleChange = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateUser({ id: user.user_id, userData: formUser })).unwrap();
        setOpenModalInfo(true)

    };

    const closeModalInfo = () => {
        setOpenModalInfo(false);
        window.location.reload();

        // navigate('/')
    }

    const toggleModalConfirm = () => {
        setOpenModalConfirm(!openModalConfirm);
    }

    const confirmDeleteUser = async () => {
        dispatch(deleteUser(user.user_id));
        navigate('/');
        setOpenModalConfirm(false);

    }

    const deleteProfilPicture = async () => {
        await dispatch(deleteProfilPic(user.user_id)).unwrap()
        window.location.reload();

        // navigate('/')
    }

    return (
        <section>
            <h2 className='user-title'>Profil de {user?.pseudo}</h2>
            <UserForm
                user={user ? user : []}
                formUser={formUser}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                errorMessage={error}
                isLoading={status === 'loading' || statusPhoto === 'loading'}
                toggleModalConfirm={toggleModalConfirm}
                deleteProfilPicture={deleteProfilPicture}

            />
            {comments && comments.length > 0 &&
                <div>
                    <h3>Commentaires de l'utilisateur :</h3>
                    <CommentsList comments={comments} />
                </div>
            }
            {posts && posts.length > 0 &&
                <div>
                    <h3>Articles de l'utilisateur :</h3>
                    <PostsLists posts={posts} />
                </div>

            }
            {openModalInfo &&
                <Modal
                    title="Informations sauvegardées"
                    content={<p>Le profil à bien été modifié :</p>}
                    validButton='Ok'
                    open={openModalInfo}
                    cancel={closeModalInfo}
                    valid={closeModalInfo}
                />
            }

            {openModalConfirm &&
                <Modal
                    title="Êtes vous sûr ?"
                    content={
                        <div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <p>Voulez-vous vraiment <strong style={{ color: 'red' }}>supprimer</strong> le compte de manière <strong style={{ color: 'red' }}>définitive</strong> ?</p>
                            <strong style={{ color: 'red' }}>Cet action est irréversible !</strong>
                        </div>
                    }
                    validButton='Oui je suis sûr'
                    cancelButton='Annuler'
                    open={openModalConfirm}
                    cancel={toggleModalConfirm}
                    valid={confirmDeleteUser}
                />
            }
        </section>
    );
}

export default UserPageAdmin;