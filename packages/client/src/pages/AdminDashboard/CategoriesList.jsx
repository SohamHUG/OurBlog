import * as React from 'react';
import * as Redux from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors';
import { fetchCategories, createCategory, deleteCategory } from '../../store/slice/categoriesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoriesList = () => {
    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const status = Redux.useSelector(selectCategoriesStatus);
    const error = Redux.useSelector(selectCategoriesError);
    const [newCategory, setNewCategory] = React.useState('')
    const navigate = useNavigate();

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);

    const handleNewCategory = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createCategory(newCategory)).unwrap()
            setNewCategory('')
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleChangeNewCategory = async (e) => {
        e.preventDefault();
        setNewCategory(e.target.value)

    }

    const handleRemoveCategory = (id) => {
        dispatch(deleteCategory(id));
    }

    return (
        <section className="page-admin">
            <div className='header-page'>
                <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                <h2>Les catégories</h2>
            </div>
            {status === 'loading' &&
                <div>Loading</div>
            }

            {status === 'failed' &&
                <div style={{ textAlign: 'center' }} className='alert'>{error}</div>
            }

            {categories && categories.length > 0 &&
                <div className='categories-container'>
                    <form onSubmit={handleNewCategory}>
                        <label htmlFor="cate">Ajouter une nouvelle catégorie :</label>
                        <input autoComplete='off' placeholder='...' id='cate' type='text' onChange={handleChangeNewCategory} value={newCategory} />
                        <button type='submit'>Ajouter</button>
                    </form>
                    {categories.map((category) => {
                        return (
                            <div key={category.id} className='category'>
                                <span>{category.name}</span>
                                <DeleteIcon className="delete-btn" onClick={() => handleRemoveCategory(category.id)} />
                            </div>

                        )

                    })}

                </div>
            }

        </section>
    );
};

export default CategoriesList;