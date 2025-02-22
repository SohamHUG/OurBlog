import * as React from 'react';
import * as Redux from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors';
import { fetchCategories } from '../../store/slice/categoriesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './CategoriesPage.scss';

const AllCategories = () => {
    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const status = Redux.useSelector(selectCategoriesStatus);
    const error = Redux.useSelector(selectCategoriesError);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);


    return (
        <section className='categories-page'>
            <div className='header-page'>
                <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                <h2>Toutes les catégories :</h2>
            </div>

            {status === 'loading' &&
                <div>Loading</div>
            }

            {status === 'failed' &&
                <div>{error}</div>
            }

            {categories && categories.length > 0 &&
                <div className='categories-container'>
                    {categories.map((category) => {
                        return (
                            <NavLink to={`/category/${category.id}`} key={category.id} className='category'>
                                <span className='link' >
                                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                    <ArrowForwardIcon />
                                </span>
                            </NavLink>
                        )

                    })}
                </div>
            }
        </section>
    )
};

export default AllCategories;