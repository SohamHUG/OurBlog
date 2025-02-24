import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../../store/selectors/index.js';
import { fetchCategories } from '../../../store/slice/categoriesSlice.js';
import { createArticle } from '../../../store/slice/articleSlice.js';
import RichTextEditor from '../../../components/RichTextEditor/RichTextEditor.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import { useNavigate, Navigate } from 'react-router-dom';
import ArticleForm from '../../../components/ArticleForm/ArticleForm.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { uploadImagesAndUpdateContent } from '../../../store/slice/photoSlice.js';


const CreateArticlePage = () => {
    const dispatch = Redux.useDispatch();
    const articleError = Redux.useSelector((state) => state.articles.error)
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
            const { updatedContent, imagesId } = await dispatch(uploadImagesAndUpdateContent({ content: formData.content })).unwrap();
            const updatedFormData = { ...formData, content: updatedContent, imagesId };

            // console.log(updatedFormData)

            const article = await dispatch(createArticle(updatedFormData)).unwrap();;

            setNewId(article.article.id);
            setOpenModal(true);
        } catch (error) {
            if (!articleError) {
                setErrorMessage("Une erreur s'est produite lors de la modification de votre article.");
            }
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
        <section>
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
                errorMessage={articleError || errorMessage}
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
        </section>
    );
};

export default CreateArticlePage;

