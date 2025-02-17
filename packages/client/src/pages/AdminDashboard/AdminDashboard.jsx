import * as React from 'react';
import * as Redux from 'react-redux';
import { Navigate, NavLink } from 'react-router-dom';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors';
import { fetchCategories, createCategory, deleteCategory } from '../../store/slice/categoriesSlice';

const AdminDashboard = () => {
    const dispatch = Redux.useDispatch();

    return (
        <div className="page">
            <h1>Admin Dashboard</h1>

            <div>
                <NavLink className={'link'} to={'/admin/categories'}>
                    Catégories
                </NavLink>
                <br/>
                <NavLink className={'link'} to={'/admin/users'}>
                    Utilisateurs
                </NavLink>
            </div>
            

        </div>
    );
};

export default AdminDashboard;