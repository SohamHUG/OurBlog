import * as React from 'react';
import * as Redux from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors';
import { fetchCategories, createCategory, deleteCategory } from '../../store/slice/categoriesSlice';

const AdminDashboard = () => {

    const dispatch = Redux.useDispatch();
    const categories = Redux.useSelector(selectCategories);
    const status = Redux.useSelector(selectCategoriesStatus);
    const error = Redux.useSelector(selectCategoriesError);
    const [newCategory, setNewCategory] = React.useState('')

    // const user = Redux.useSelector((state) => state.auth.user);

    // if (!user || user.role_name !== 'admin') {
    //     return <Navigate to="/not-allowed" />;
    // }
    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);

    const handleNewCategory = (e) => {
        e.preventDefault();
        dispatch(createCategory(newCategory));
    }

    const handleRemoveCategory = (id) => {
        dispatch(deleteCategory(id));
    }

    return (
        <div className="page">
            <h1>Admin Dashboard</h1>
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
                                {category.name}
                                <button onClick={() => handleRemoveCategory(category.id)}>-</button>
                            </div>

                        )

                    })}
                    <form onSubmit={handleNewCategory}>
                        <input type='text' style={{border: 'solid'}} onChange={(e) => setNewCategory(e.target.value)}/>
                        <button type='submit'>+</button>
                    </form>
                </div>
            }

        </div>
    );
};

export default AdminDashboard;