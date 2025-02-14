import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors/index';
import { fetchCategories } from '../../store/slice/categoriesSlice';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import './ArticleForm.scss'

const ArticleForm = ({
    formData,
    handleChange,
    handleContentChange,
    handleTagsChange,
    handleSubmit,
    errorMessage
}) => {
    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const CategoriesStatus = Redux.useSelector(selectCategoriesStatus);
    const error = Redux.useSelector(selectCategoriesError);
    const status = Redux.useSelector((state) => state.photos.status)


    const isFormValid = formData.title.trim() !== "" &&
        formData.category &&
        formData.content.replace(/<[^>]+>/g, '').trim() !== "";

    // console.log(isFormValid)


    React.useEffect(() => {
        if (CategoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [CategoriesStatus, dispatch]);


    return (
        <div className="article-form-container">
            {/* <div className="back-button" onClick={goBack}>
                <ArrowBackIcon />
            </div> */}

            <form onSubmit={handleSubmit}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <div className='duo-container'>
                    <div>
                        <label htmlFor='title'>Titre* :</label>
                        <input
                            type="text"
                            name="title"
                            id='title'
                            placeholder="Titre de l'article"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='category'>Catégorie* :</label>
                        <select id='category' name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">-- Sélectionnez une catégorie --</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <label htmlFor='tags'>Tags (séparés par un #) :</label>
                <input
                    type="text"
                    id='tags'
                    placeholder="ex: recette#à faire#dessert"
                    value={formData.tags.join('#')}
                    onChange={handleTagsChange}
                />

                <div>
                    <label>Contenu* :</label>
                    <small>La première image du contenu sera utilisé comme miniature</small>
                    {status === 'loading' &&
                        <span>
                            <CircularProgress size="25px" />
                        </span>
                    }
                    <RichTextEditor value={formData.content} onChange={handleContentChange} />
                </div>

                <button type="submit" disabled={!isFormValid}>
                    Publier
                </button>
            </form>
        </div>
    );
};

export default ArticleForm;

