import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { deleteProfilPic } from '../../store/slice/photoSlice';
import Modal from '../../components/Modal/Modal';
import UserForm from '../../components/UserForm/UserForm';
import { getProfil, updateUser, deleteUser, resetProfil } from '../../store/slice/userSlice';
import { getArticles, resetArticles } from '../../store/slice/articleSlice';
import { getComments } from '../../store/slice/commentSlice';
import CommentsList from '../../components/CommentsList/CommentsList'
import PostsLists from '../../components/PostsList/PostsList'
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { selectAuthorArticles, selectAuthorArticlesHasMore, selectAuthorArticlesPage, selectAuthorArticlesStatus, selectComments, selectPhotosStatus, selectProfil, selectUsersError, selectUsersStatus } from '../../store/selectors';

const UserPageAdmin = () => {
    const user = Redux.useSelector(selectProfil);
    const { id } = useParams()
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate();
    const [openModalInfo, setOpenModalInfo] = React.useState(false);
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const status = Redux.useSelector(selectUsersStatus);
    const error = Redux.useSelector(selectUsersError);
    const statusPhoto = Redux.useSelector(selectPhotosStatus)
    const posts = Redux.useSelector(selectAuthorArticles)
    const statusPosts = Redux.useSelector(selectAuthorArticlesStatus)
    const hasMore = Redux.useSelector(selectAuthorArticlesHasMore)
    const page = Redux.useSelector(selectAuthorArticlesPage)
    const comments = Redux.useSelector(selectComments)
    const [formUser, setFormUser] = React.useState({
        firstName: '',
        lastName: '',
        pseudo: '',
        email: '',
        newEmail: '',
        role: 1,
    });

    React.useEffect(() => {
        dispatch(resetProfil())
        dispatch(getProfil(id))
        dispatch(resetArticles({ context: 'author' }));
        dispatch(getComments({
            userId: id
        }))
    }, [dispatch, id])

    // console.log(user)

    React.useEffect(() => {
        if (user && user.user_id) {
            setFormUser({
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                pseudo: user.pseudo,
                email: user.email || '',
                role: user.role_id || 1,
                newEmail: '',
            })
        }

    }, [user, dispatch])

    React.useEffect(() => {
        dispatch(getArticles({
            context: 'author',
            userId: id,
            limit: 10,
            page
        }))

    }, [user, dispatch, page])

    const handleChange = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateUser({ id: user.user_id, userData: formUser })).unwrap();
            setOpenModalInfo(true)
        } catch (error) {
            console.error(error.message)
        }

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
        try {
            dispatch(deleteUser(user.user_id)).unwrap();
            navigate(-1);
            setOpenModalConfirm(false);
        } catch (error) {
            console.error(error.message)
        }

    }

    const deleteProfilPicture = async () => {
        try {
            await dispatch(deleteProfilPic(user.user_id)).unwrap()
            window.location.reload();

        } catch (error) {
            console.error(error.message)
        }

    }

    return (
        <section className='page-admin'>
            <div className='header-page'>
                <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                <h2 className='user-title'>Profil de {user?.pseudo}</h2>
            </div>
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
                    <InfiniteScroll
                        context="author"
                        isLoading={statusPosts === 'loading'}
                        hasMore={hasMore}
                    />
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