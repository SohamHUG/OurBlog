import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useParams } from "react-router-dom";
import MainTemplate from './components/Template/MainTemplate';
import HomePage from './pages/Home/Home.page';
import Err404 from './pages/ErrorPages/404/404';
import Err403 from './pages/ErrorPages/403/403';
import PrivacyPolicy from './pages/legal/PrivacyPolicy.page';
import TermsOfService from './pages/legal/TermsOfService.page';
import CategoryPage from './pages/CategoryPage/Category.page';
import AllCategories from './pages/AllCategories/AllCategories.page';
import './App.scss'
import RegisterPage from './pages/RegisterPage/Register.page';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import { getUser, logoutUser } from './store/slice/userSlice';
import ConfirmEmail from './pages/ConfirmEmail/ConfirmEmail';
import CreateArticle from './pages/Author/CreateArticle/CreateArticle';
import ProfilPage from './pages/Profil/Profil.page';

function App() {

    const dispatch = useDispatch();
    const userConnected = useSelector((state) => state.auth.userConnected);
    const user = useSelector((state) => state.users.user);

    React.useEffect(() => {
        if (userConnected) {
            dispatch(getUser());
        } else {
            dispatch(logoutUser())
        }
    }, [dispatch, userConnected]);

    return (
        <>
            <Routes>
                <Route element={<MainTemplate />}>
                    <Route path={'/'} element={<HomePage />} />
                    <Route path="/category/:categoryId" element={<CategoryPage />} />
                    <Route path="/categories" element={<AllCategories />} />
                    <Route path={'/user-agreement'} element={<TermsOfService />} />
                    <Route path={'/privacy-policy'} element={<PrivacyPolicy />} />
                    <Route path={'/register'} element={<RegisterPage />} />
                    <Route path={'/confirm/:token'} element={<ConfirmEmail />} />
                    <Route path={'/profil'} element={<ProfilPage />} />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute roles={["admin"]}>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/article/create"
                        element={
                            <PrivateRoute role={["author", "admin"]}>
                                <CreateArticle />
                            </PrivateRoute>
                        }
                    />

                    <Route path={'*'} element={<Err404 />} />
                    <Route path={'/not-allowed'} element={<Err403 />} />
                </Route>


            </Routes>
        </>
    )
}

export default App
