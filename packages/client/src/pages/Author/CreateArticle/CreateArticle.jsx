import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../../store/selectors';
import { fetchCategories } from '../../../store/slice/categoriesSlice';
import { createPost } from '../../../store/slice/postSlice';

const CreateArticle = () => {
    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const CategoriesStatus = Redux.useSelector(selectCategoriesStatus);
    const error = Redux.useSelector(selectCategoriesError);

    React.useEffect(() => {
        if (CategoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);

    const [formData, setFormData] = React.useState({
        title: '',
        content: '',
        category: '',
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(createPost(formData));
        
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2>Créez votre article</h2>
            {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
            <label>
                Titre :
                <input type="text" name="title" value={formData.title} onChange={handleChange} />
            </label>

            <label>
                Catégorie :
                <select name="category" id="category" value={formData.category} onChange={handleChange}>
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
                Article
                <textarea name="content" value={formData.content} onChange={handleChange} />
            </label>
            <button type="submit">
                Publier
            </button>
        </form>
    );
};

export default CreateArticle;

