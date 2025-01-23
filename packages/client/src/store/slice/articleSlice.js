import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getPosts = createAsyncThunk(
    "posts/getPosts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `http://localhost:3000/articles`
            );
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des posts.");
            }

            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getPost = createAsyncThunk(
    "posts/getPost",
    async (id) => {

        const response = await fetch(
            `http://localhost:3000/articles/${id}`
        );
        if (!response.ok) {
            throw new Error("Erreur lors du chargement du post.");
        }

        return await response.json();

    }
);

export const createPost = createAsyncThunk('posts/createPost', async (articleData, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/articles/create-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(articleData),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData.message);
        }

        return await response.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        post: null,
        page: 1,
        loading: true,
        error: null,
        errorPost: null,
        status: "idle",
        statusPosts: "idle",
        statusPost: "idle",
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(action.payload)
                state.posts = action.payload.articles;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getPost.pending, (state) => {
                state.statusPost = 'loading';
                state.errorPost = null;
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.statusPost = 'succeeded';
                // console.log(action.payload)
                state.post = action.payload.article;
            })
            .addCase(getPost.rejected, (state, action) => {
                state.statusPost = 'failed';
                // console.log(action.error)
                state.errorPost = action.error.message;
            })
            .addCase(createPost.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(action)

            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});


export default postsSlice.reducer;
