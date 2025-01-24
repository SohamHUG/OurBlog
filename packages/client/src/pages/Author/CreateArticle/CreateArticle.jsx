import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../../store/selectors';
import { fetchCategories } from '../../../store/slice/categoriesSlice';
import { createPost } from '../../../store/slice/articleSlice';
import RichTextEditor from '../../../components/RichTextEditor/RichTextEditor';
import Modal from '../../../components/Modal/Modal';
import { useNavigate, Navigate } from 'react-router-dom';

const CreateArticle = () => {
    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const CategoriesStatus = Redux.useSelector(selectCategoriesStatus);
    const error = Redux.useSelector(selectCategoriesError);
    const [openModal, setOpenModal] = React.useState(false);
    const [newId, setNewId] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (CategoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [CategoriesStatus, dispatch]);

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

        // console.log(formData.tags)
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
            setNewId(article.payload.article);
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
            <form onSubmit={handleSubmit}>
                <h2>Créez votre article</h2>
                {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
                <label>
                    Titre :
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </label>

                <label>
                    Catégorie :
                    <select name="category" id="category" value={formData.category} onChange={handleChange} required>
                        <option value="">-- Sélectionnez une catégorie --</option>
                        {categories.map((category) => {
                            return (
                                <option key={category.id} value={category.id}>
                                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                </option>
                            )
                        })}
                    </select>
                </label>

                <label>
                    Tags (séparés par un #) :
                    <input
                        type="text"
                        placeholder="ex: cuisine#recette#dessert"
                        onChange={handleTagsChange}
                        value={formData.tags.join('#')}
                    />
                </label>

                <label>
                    Contenu :
                </label>
                <RichTextEditor value={formData.content} onChange={handleContentChange} />

                <button type="submit">
                    Publier
                </button>
            </form>

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

