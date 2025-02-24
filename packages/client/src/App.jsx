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
import SignUp from './pages/SignUpPage/SignUp.page';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.page';
import ConfirmEmail from './pages/ConfirmEmail/ConfirmEmail';
import CreateArticle from './pages/Author/CreateArticle/CreateArticle.page';
import MyProfilPage from './pages/MyProfil/MyProfil.page';
import Article from './pages/Article/Article.page';
import DashBoardAuthor from './pages/Author/AuthorDashboard/DashboardAuthor.page';
import UpdateArticlePage from './pages/Author/UpdateArticle/UpdateArticle.page';
import ProfilPage from './pages/Profil/Profil.page';
import SearchResultsPage from './pages/SearchResultsPage/SearchResults.page';
import { getMe, logoutUser } from './store/slice/authSlice';
import CategoriesList from './pages/AdminDashboard/CategoriesList';
import UsersList from './pages/AdminDashboard/UsersList';
import UserPageAdmin from './pages/AdminDashboard/UserPageAdmin';
import TagsList from './pages/AdminDashboard/TagsList';
import ContactPage from './pages/Contact/Contact.page';

function App() {

    const dispatch = useDispatch();
    const { userConnected, status, user } = useSelector((state) => state.auth);
    // const { user } = useSelector((state) => state.auth);

    // console.log(user)
    // console.log(userConnected)

    React.useEffect(() => {
        if (userConnected) {
            dispatch(getMe());
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
                    <Route path={'/register'} element={<SignUp />} />
                    <Route path={'/confirm/:token'} element={<ConfirmEmail />} />
                    <Route path={'/search'} element={<SearchResultsPage />} />
                    <Route path={'/article/:id'} element={<Article />} />
                    <Route path={'/profil/:id'} element={<ProfilPage />} />
                    <Route path={'/contact'} element={<ContactPage />} />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute roles={["admin"]}>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/categories"
                        element={
                            <PrivateRoute roles={["admin"]}>
                                <CategoriesList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/tags"
                        element={
                            <PrivateRoute roles={["admin"]}>
                                <TagsList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <PrivateRoute roles={["admin"]}>
                                <UsersList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/user/:id"
                        element={
                            <PrivateRoute roles={["admin"]}>
                                <UserPageAdmin />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path={'/profil'}
                        element={
                            <PrivateRoute roles={["author", "admin", "user", "moderator"]}>
                                <MyProfilPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/articles"
                        element={
                            <PrivateRoute roles={["author", "admin"]}>
                                <DashBoardAuthor />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/article/create"
                        element={
                            <PrivateRoute roles={["author", "admin"]}>
                                <CreateArticle />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/articles/update/:id"
                        element={
                            <PrivateRoute roles={["author", "admin"]} >
                                <UpdateArticlePage />
                            </PrivateRoute>
                        }
                    />


                    <Route path={'/not-allowed'} element={<Err403 />} />
                    <Route path={'*'} element={<Err404 />} />
                </Route>


            </Routes>
        </>
    )
}

export default App
