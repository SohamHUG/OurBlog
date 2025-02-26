import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors';
import { fetchCategories, createCategory, deleteCategory } from '../../store/slice/categoriesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from "@mui/icons-material/Category";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AbcIcon from '@mui/icons-material/Abc';
import './AdminDashBoard.scss';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <section className="page-admin">
            <div className='header-page'>
                <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                <h2>Admin Dashboard</h2>
            </div>


            <div className='links'>
                <NavLink className={'link'} to={'/admin/users'}>
                    <span>Gérer les utilisateurs</span>
                    <PeopleAltIcon className='icon' />
                </NavLink>
                <br />
                <NavLink className={'link'} to={'/admin/categories'}>
                    <span>Gérer les catégories</span>
                    <CategoryIcon className='icon' />
                </NavLink>
                <br />
                <NavLink className={'link'} to={'/admin/tags'}>
                    <span>Gérer les tags</span>
                    <AbcIcon className='icon' />
                </NavLink>
            </div>


        </section>
    );
};

export default AdminDashboard;