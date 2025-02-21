import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { uploadProfilPic } from '../../../store/slice/photoSlice';
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

    const [profilPicture, setProfilPicture] = React.useState(null);
    const [previewImage, setPreviewImage] = React.useState(null);

    const handleChange = (e) => {
        if (e.target.name === 'profilPicture') {
            const file = e.target.files[0];
            if (file) {
                // Génère un URL temporaire pour l'aperçu
                const preview = URL.createObjectURL(file);
                setPreviewImage(preview);
            }
            setProfilPicture(file);
        } else {
            setFormUser({ ...formUser, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await dispatch(updateUser({ id: user.user_id, userData: formUser }));

        if (profilPicture) {
            const formData = new FormData();
            formData.append('profilPicture', profilPicture);
            console.log("FormData content:", formData.get('profilPicture'));
            dispatch(uploadProfilPic(formData));
            // setPreviewImage(null);
        }

        if (updateUser.fulfilled.match(data)) {
            setOpenModalInfo(true)
        }

    };

    const closeModalInfo = () => {
        setOpenModalInfo(false);
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
                isLoading={status === 'loading'}
                toggleModalConfirm={toggleModalConfirm}
                previewImage={previewImage}

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
                <PostsLists posts={posts}/>
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