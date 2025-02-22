import * as React from 'react';
import * as Redux from 'react-redux';
import { Navigate, NavLink } from 'react-router-dom';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../../store/selectors';
import { fetchCategories, createCategory, deleteCategory } from '../../../store/slice/categoriesSlice';
import { getAllUsers, resetUsers } from '../../../store/slice/userSlice';
import { useLocation } from 'react-router-dom';

const UsersList = () => {
    const dispatch = Redux.useDispatch();
    const users = Redux.useSelector((state) => state.users.users);
    const status = Redux.useSelector((state) => state.users.status);

    React.useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch]);

    // console.log(users)


    return (
        <section className="page">
            {status === 'succeeded' &&
                <div className=''>
                    {users.map((user) => {
                        return (
                            <div key={user.user_id || user.id}>
                                <NavLink to={`/admin/user/${user.user_id}`} >
                                    <div>
                                        {user.profil_picture ?
                                            <img className='avatar' src={user.profil_picture} alt="" />
                                            : ''
                                        }
                                    </div>
                                    <p>{user.pseudo}</p>
                                    <p>{user.first_name} {user.last_name}</p>
                                    <p>{user.role_name}</p>
                                    <p>
                                        {user.is_verified === 1 ?
                                            'yes'
                                            : 'no'
                                        }
                                    </p>
                                </NavLink>
                            </div>
                        )

                    })}
                </div>
            }

        </section>
    );
};

export default UsersList;