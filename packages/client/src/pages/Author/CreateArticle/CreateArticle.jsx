import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../../store/selectors';
import { fetchCategories } from '../../../store/slice/categoriesSlice';
import { createPost, getTags } from '../../../store/slice/articleSlice';
import RichTextEditor from '../../../components/RichTextEditor/RichTextEditor';

const CreateArticle = () => {
    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const CategoriesStatus = Redux.useSelector(selectCategoriesStatus);
    const { statusGetTags, tags } = Redux.useSelector((state) => state.posts)
    const error = Redux.useSelector(selectCategoriesError);

    React.useEffect(() => {
        if (CategoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
        if (statusGetTags === 'idle') {
            dispatch(getTags());
        }
    }, [CategoriesStatus, statusGetTags, dispatch]);

    const [formData, setFormData] = React.useState({
        title: '',
        content: '',
        category: '',
        tag: '',
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // console.log(formData)
    };

    const handleContentChange = React.useCallback((content) => {
        setFormData((prevFormData) => ({ ...prevFormData, content }));
        // console.log(formData)
    }, [formData, setFormData]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(createPost(formData));
        console.log(formData)

    };


    return (
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
                Tags :
                <select name="tag" id="tag" value={formData.tag} onChange={handleChange}>
                    <option value="">-- Sélectionnez un tag --</option>
                    {tags.map((tag) => {
                        return (
                            <option key={tag.id} value={tag.id}>
                                {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                            </option>
                        )
                    })}
                </select>
            </label>

            <label>
                Contenu :
            </label>
            <RichTextEditor value={formData.content} onChange={handleContentChange} />

            <button type="submit">
                Publier
            </button>
        </form>
    );
};

export default CreateArticle;

