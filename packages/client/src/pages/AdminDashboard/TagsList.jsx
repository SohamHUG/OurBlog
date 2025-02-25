import * as React from 'react';
import * as Redux from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { selectCategories, selectCategoriesStatus, selectCategoriesError, selectTags, selectTagsStatus } from '../../store/selectors';
import { fetchCategories, createCategory, deleteCategory, getTags, deleteTag } from '../../store/slice/categoriesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

const TagsList = () => {
    const dispatch = Redux.useDispatch();
    const tags = Redux.useSelector(selectTags);
    const status = Redux.useSelector(selectTagsStatus);
    const error = Redux.useSelector(selectCategoriesError);
    const [newTag, setNewTag] = React.useState('')
    const navigate = useNavigate();

    React.useEffect(() => {
        // if (status === 'idle') {
            dispatch(getTags());
        // }
    }, []);

    // const handleNewTag = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await dispatch(createCategory(newCategory)).unwrap()
    //         setNewTag('')
    //     } catch (error) {
    //         console.error(error.message)
    //     }
    // }

    // const handleChangeNewTag = async (e) => {
    //     e.preventDefault();
    //     setNewTag(e.target.value)

    // }

    const handleRemoveTag = (id) => {
        // dispatch(deleteCategory(id));
        dispatch(deleteTag(id))
    }

    return (
        <section className="page-admin">
            <div className='header-page'>
                <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                <h2>Les Tags</h2>
            </div>
            {status === 'loading' &&
                <div>Loading</div>
            }

            {status === 'failed' &&
                <div style={{ textAlign: 'center' }} className='alert'>{error}</div>
            }

            {tags && tags.length > 0 &&
                <div className='categories-container'>
                    {/* <form onSubmit={handleNewTag}>
                        <label htmlFor="tag">Ajouter un nouveau tag :</label>
                        <input autoComplete='off' placeholder='...' id='tag' type='text' onChange={handleChangeNewTag} value={newTag} />
                        <button type='submit'>Ajouter</button>
                    </form> */}
                    {tags.map((tag) => {
                        return (
                            <div key={tag.id} className='category'>
                                <span>{tag.name}</span>
                                <DeleteIcon className="delete-btn" onClick={() => handleRemoveTag(tag.id)} />
                            </div>

                        )

                    })}

                </div>
            }

        </section>
    );
};

export default TagsList;