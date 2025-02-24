import * as React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteArticle, getArticle, updateArticle } from '../../../store/slice/articleSlice.js';
import ArticleForm from '../../../components/ArticleForm/ArticleForm.jsx';
import { uploadImagesAndUpdateContent } from '../../../store/slice/photoSlice.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from "../../../components/Modal/Modal.jsx";


const UpdateArticlePage = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const { post, status, error } = useSelector((state) => state.articles)
    const [errorMessage, setErrorMessage] = React.useState("");
    const [openModalConfirm, setOpenModalConfirm] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    React.useEffect(() => {
        dispatch(getArticle(id));
    }, [id, dispatch]);

    // console.log(status)

    const [formData, setFormData] = React.useState({
        title: '',
        content: '',
        category: '',
        tags: [],
    });

    React.useEffect(() => {
        if (status === 'succeeded' && post) {
            setFormData({
                title: post.title || '',
                content: post.content,
                category: post.category_id || '',
                tags: post.tags ? post.tags.split(', ') : [],
            })
            // handleContentChange(post.content)
        }
    }, [status]);

    // console.log(post.content)

    const handleTagsChange = (e) => {
        const input = e.target.value;
        const tagsArray = input.split('#');

        setFormData({ ...formData, tags: tagsArray });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };

    const handleContentChange = React.useCallback((content) => {
        setFormData((prevFormData) => ({ ...prevFormData, content }));
    }, [formData, setFormData]);

    const toggleModalConfirm = () => {
        setOpenModalConfirm(true);
    };

    const closeModalConfirm = () => {
        setOpenModalConfirm(false);
    };

    const confirmDeleteArticle = async () => {
        try {
            await dispatch(deleteArticle(parseInt(id))).unwrap();
            closeModalConfirm();
            navigate('/')
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article')
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() ||
            !formData.category ||
            !formData.content.replace(/<[^>]+>/g, '').trim()) {

            setErrorMessage("Veuillez remplir tous les champs obligatoires (titre, catégorie, contenu)");
            return;
        }

        setErrorMessage("");

        try {
            const { updatedContent } = await dispatch(uploadImagesAndUpdateContent({ content: formData.content })).unwrap();
            const updatedFormData = { ...formData, content: updatedContent };

            const articleUp = await dispatch(updateArticle({ id: post.id, articleData: updatedFormData })).unwrap();
            navigate(`/article/${articleUp.article.id}`);

        } catch (error) {
            if (status !== 'failed') {
                setErrorMessage("Une erreur s'est produite lors de la modification de votre article.");
            }

        }

    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <Navigate to="/not-allowed" />;
    }

    if (post && user && (post.user_id !== user.user_id && user.role_name !== 'admin')) {
        return <Navigate to="/not-allowed" />;
    }

    return (
        <>
            {status === 'succeeded' && post &&
                <section>
                    <div className='header'
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #eee',
                            justifyContent: 'space-around',
                            padding: '0 .5em'
                        }}
                    >
                        <ArrowBackIcon className='link back-btn' onClick={goBack} />
                        <h2 style={{ textAlign: 'center', flex: '1' }}>Modifier l'article : {post.title}</h2>
                        <DeleteIcon className="delete-btn" onClick={() => toggleModalConfirm()} />
                    </div>
                    <ArticleForm
                        formData={formData}
                        handleChange={handleChange}
                        handleContentChange={handleContentChange}
                        handleTagsChange={handleTagsChange}
                        handleSubmit={handleSubmit}
                        errorMessage={error || errorMessage}
                    />
                    {openModalConfirm && (
                        <Modal
                            title="Êtes-vous sûr ?"
                            content={
                                <div>
                                    <p>
                                        Voulez-vous vraiment <strong style={{ color: 'red' }}>supprimer</strong> cet article de manière <strong style={{ color: 'red' }}>définitive</strong> ?
                                    </p>
                                    <strong style={{ color: 'red' }}>Cette action est irréversible !</strong>
                                </div>
                            }
                            validButton='Oui, je suis sûr'
                            cancelButton='Annuler'
                            open={openModalConfirm}
                            cancel={closeModalConfirm}
                            valid={confirmDeleteArticle}
                        />
                    )}
                </section>
            }
        </>)
};

export default UpdateArticlePage;