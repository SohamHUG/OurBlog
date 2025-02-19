import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slice/themeSlice';
import postsReducer from './slice/articleSlice';
import usersReducer from './slice/userSlice';
import photosReducer from './slice/photoSlice';
import categoriesReducer from './slice/categoriesSlice';
import authReducer from './slice/authSlice';
import commentReducer from './slice/commentSlice'
import searchReducer from './slice/searchSlice'

const store = configureStore({
    reducer: {
        theme: themeReducer,
        posts: postsReducer,
        users: usersReducer,
        photos: photosReducer,
        categories: categoriesReducer,
        auth: authReducer,
        comments: commentReducer,
        search: searchReducer,
    },

    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false, // Désactive le middleware qui vérifie la sérialisation
    //     }),
});

export default store;