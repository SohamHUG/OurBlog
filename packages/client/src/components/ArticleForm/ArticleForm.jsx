import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors/index';
import { fetchCategories } from '../../store/slice/categoriesSlice';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

const ArticleForm = ({
    formData,
    handleChange,
    handleContentChange,
    handleTagsChange,
    handleSubmit,
}) => {
    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const CategoriesStatus = Redux.useSelector(selectCategoriesStatus);
    const error = Redux.useSelector(selectCategoriesError);

    React.useEffect(() => {
        if (CategoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [CategoriesStatus, dispatch]);


    return (
        <>
            <form onSubmit={handleSubmit}>
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
                        placeholder="ex: recette#à faire#dessert"
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
        </>
    );
};

export default ArticleForm;

