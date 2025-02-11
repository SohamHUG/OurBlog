import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../../store/selectors';
import { fetchCategories } from '../../../store/slice/categoriesSlice';
import { createPost } from '../../../store/slice/articleSlice';
import RichTextEditor from '../../../components/RichTextEditor/RichTextEditor';
import Modal from '../../../components/Modal/Modal';
import { useNavigate, Navigate } from 'react-router-dom';
import ArticleForm from '../../../components/ArticleForm/ArticleForm.jsx';

const CreateArticle = () => {
    const dispatch = Redux.useDispatch();
    const [openModal, setOpenModal] = React.useState(false);
    const [newId, setNewId] = React.useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        title: '',
        content: '',
        category: '',
        tags: [],
    });

    // console.log(formData)

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        const article = await dispatch(createPost(formData));

        if (createPost.fulfilled.match(article)) {
            setNewId(article.payload.article.id);
            setOpenModal(true);
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
            <h2>Créez votre article</h2>
            <ArticleForm
                formData={formData}
                handleChange={handleChange}
                handleContentChange={handleContentChange}
                handleTagsChange={handleTagsChange}
                handleSubmit={handleSubmit}
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

