import * as React from 'react';
import * as Redux from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../../store/selectors';
import { fetchCategories, createCategory, deleteCategory } from '../../../store/slice/categoriesSlice';
import { getAllUsers } from '../../../store/slice/userSlice';
import { useLocation } from 'react-router-dom';

const UsersList = () => {
    const dispatch = Redux.useDispatch();
    const users = Redux.useSelector((state) => state.users.users);
    const status = Redux.useSelector((state) => state.users.status);

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(getAllUsers())
        }

    }, [dispatch, status]);

    // console.log(users)


    return (
        <div className="page">
            {status === 'succeeded' &&
            <div className=''>
                {users.map((user) => {
                    return (
                        <div key={user.user_id} className='category'>
                            {user.pseudo}
                        </div>

                    )

                })}
            </div>
            }

        </div>
    );
};

export default UsersList;