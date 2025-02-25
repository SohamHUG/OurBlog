import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slice/themeSlice';
import articlesReducer from './slice/articleSlice';
import usersReducer from './slice/userSlice';
import photosReducer from './slice/photoSlice';
import categoriesReducer from './slice/categoriesSlice';
import authReducer from './slice/authSlice';
import commentReducer from './slice/commentSlice'
import searchReducer from './slice/searchSlice'

const store = configureStore({
    reducer: {
        theme: themeReducer,
        articles: articlesReducer,
        users: usersReducer,
        photos: photosReducer,
        categories: categoriesReducer,
        auth: authReducer,
        comments: commentReducer,
        search: searchReducer,
    },

    devTools: import.meta.env.MODE !== "production",
    
});

export default store;