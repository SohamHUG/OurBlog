import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError, selectUser } from '../../store/selectors/index';
import { fetchCategories } from '../../store/slice/categoriesSlice';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import './ArticleForm.scss';

const ArticleForm = ({
    formData,
    handleChange,
    handleContentChange,
    handleTagsChange,
    handleSubmit,
    errorMessage,
    isLoading
}) => {
    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const CategoriesStatus = Redux.useSelector(selectCategoriesStatus);
    const error = Redux.useSelector(selectCategoriesError);
    const user = Redux.useSelector(selectUser)


    const isFormValid = formData.title.trim() !== "" &&
        formData.category &&
        formData.content.replace(/<[^>]+>/g, '').trim() !== "" &&
        user && user.is_verified === 1;

    // console.log(isFormValid)


    React.useEffect(() => {
        if (CategoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [CategoriesStatus, dispatch]);


    return (
        <div className="article-form-container">

            {user && user.is_verified === 0 &&
                <>
                    <span className='alert'>Si vous souhaitez publier un article, merci de verifier votre adresse email.</span><br />
                    <small><NavLink to={'/profil'} style={{ textDecoration: 'underline' }} className={'link'}>Voir mon profil</NavLink></small>
                </>
            }

            <form onSubmit={handleSubmit}>


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
                            disabled={user && user.is_verified === 0}
                        />
                    </div>

                    <div>
                        <label htmlFor='category'>Catégorie* :</label>
                        <select id='category' name="category" value={formData.category} onChange={handleChange} required disabled={user && user.is_verified === 0}>
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
                    autoComplete='off'
                    placeholder="ex: recette#à faire#dessert"
                    value={formData.tags.join('#')}
                    onChange={handleTagsChange}
                    disabled={user && user.is_verified === 0}
                />
                {user && user.is_verified === 1 &&
                    <div>
                        <label>Contenu* :</label>
                        <small>La première image du contenu sera utilisé comme miniature</small>


                        <RichTextEditor value={formData.content} onChange={handleContentChange} />


                    </div>
                }

                <div className='form-footer'>
                    {isLoading &&
                        <span>
                            <CircularProgress />
                        </span>
                    }
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <button type="submit"
                    // disabled={!isFormValid}
                    >
                        Publier
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ArticleForm;

