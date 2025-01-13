import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors';
import { fetchCategories } from '../../store/slice/categoriesSlice';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const dispatch = Redux.useDispatch()
    const category = Redux.useSelector(selectCategories).find((category) => category.id === Number(categoryId));
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
                <div>
                    <h1>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h1>
                </div>
            }
        </>
    );
};

export default CategoryPage;