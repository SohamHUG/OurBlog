import * as React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors';
import { fetchCategories } from '../../store/slice/categoriesSlice';

const AllCategories = () => {
    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const status = Redux.useSelector(selectCategoriesStatus);
    const error = Redux.useSelector(selectCategoriesError);

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);


    return (
        <>
            {status === 'loading' &&
                <div>Loading</div>
            }

            {status === 'failed' &&
                <div>{error}</div>
            }

            {status === 'succeeded' &&
                <div className='categories-page'>
                    {categories.map((category) => {
                        return (
                            <div key={category.id} className='category'>
                                <Link to={`/category/${category.id}`}>
                                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                </Link>
                            </div>
                        )

                    })}
                </div>
            }
        </>
    )
};

export default AllCategories;