import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../../store/selectors';
import { fetchCategories } from '../../../store/slice/categoriesSlice';
import { createPost } from '../../../store/slice/articleSlice';
import RichTextEditor from '../../../components/RichTextEditor/RichTextEditor';
import Modal from '../../../components/Modal/Modal';
import { useNavigate, Navigate } from 'react-router-dom';
import ArticleForm from '../../../components/ArticleForm/ArticleForm.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { uploadImagesAndUpdateContent } from '../../../store/slice/photoSlice.js';


const CreateArticle = () => {
    const dispatch = Redux.useDispatch();
    const error = Redux.useSelector((state) => state.posts.error)
    const [openModal, setOpenModal] = React.useState(false);
    const [newId, setNewId] = React.useState(null);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = React.useState("");

    const [formData, setFormData] = React.useState({
        title: '',
        content: '',
        category: '',
        tags: [],
    });

    const handleTagsChange = (e) => {
        const input = e.target.value;
        const tagsArray = input.split('#');

        setFormData({ ...formData, tags: tagsArray });
    };

    const goBack = () => navigate(-1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };

    const handleContentChange = React.useCallback((content) => {
        setFormData((prevFormData) => ({ ...prevFormData, content }));
    }, [formData, setFormData]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() ||
            !formData.category.trim() ||
            !formData.content.replace(/<[^>]+>/g, '').trim()) {

            setErrorMessage("Veuillez remplir tous les champs obligatoires (titre, catégorie, contenu)");
            return;
        }

        setErrorMessage("");

        try {
            const updatedContent = await dispatch(uploadImagesAndUpdateContent({ content: formData.content })).unwrap();
            const updatedFormData = { ...formData, content: updatedContent };

            const article = await dispatch(createPost(updatedFormData));

            if (createPost.fulfilled.match(article)) {
                setNewId(article.payload.article.id);
                setOpenModal(true);
            }
        } catch (error) {
            console.error('Erreur lors du téléchargement des images :', error);
            setErrorMessage("Une erreur s'est produite lors du téléchargement des images.");
        }

    };

    const closeModal = () => {
        setOpenModal(false);
        if (newId) {
            navigate(`/article/${newId}`);
        } else {
            navigate('/');
        }
    }

    return (
        <>
            <div className='header'
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    justifyContent: 'space-around'
                }}
            >
                <ArrowBackIcon className='link back-btn' onClick={goBack} />
                <h2 style={{ textAlign: 'center', flex: '1' }}>Créez votre article</h2>
            </div>
            <ArticleForm
                formData={formData}
                handleChange={handleChange}
                handleContentChange={handleContentChange}
                handleTagsChange={handleTagsChange}
                handleSubmit={handleSubmit}
                errorMessage={error || errorMessage}
            />

            {openModal &&
                <Modal
                    title="Article créé"
                    content={<p>Votre article à bien été publié</p>}
                    validButton='Ok'
                    open={openModal}
                    cancel={closeModal}
                    valid={closeModal}
                />
            }
        </>
    );
};

export default CreateArticle;

