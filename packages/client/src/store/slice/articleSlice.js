import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getPosts = createAsyncThunk(
    "posts/getPosts",
    async (filters, { rejectWithValue }) => {

        try {
            // let params = new URLSearchParams();
            // if (filters?.userId) {
            //     params.append("userId", filters.userId);
            // }
            // if (filters?.category) {
            //     params.append("category", filters.category);
            // }

            // const response = await fetch(
            //     `http://localhost:3000/articles?${params}`
            // );
            const response = await fetch(`http://localhost:3000/articles?${new URLSearchParams(filters)}`);

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

export const updateArticle = createAsyncThunk('posts/updateArticle', async ({ id, articleData }, { rejectWithValue }) => {
    try {
        const response = await fetch(`http://localhost:3000/articles/update/${id}`, {
            method: 'PUT',
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

export const deleteArticle = createAsyncThunk('posts/deleteArticle', async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`http://localhost:3000/articles/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', },
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
        filters: {
            tags: [],
            sortBy: 'recent'
        },
        error: null,
        errorPost: null,
        status: "idle",
    },
    reducers: {
        setTagsFilter: (state, action) => {
            state.filters.tags = action.payload;
        },
        setSortBy: (state, action) => {
            state.filters.sortBy = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload.articles;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getPost.pending, (state) => {
                state.status = 'loading';
                state.errorPost = null;
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(action.payload)
                state.post = action.payload.article;
            })
            .addCase(getPost.rejected, (state, action) => {
                state.status = 'failed';
                // console.log(action.error)
                state.errorPost = action.error.message;
            })
            .addCase(createPost.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = 'idle';
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateArticle.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.status = 'idle';
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteArticle.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const deleteId = action.meta.arg;
                state.posts = state.posts.filter((post) => post.id !== deleteId)
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});


export const { setTagsFilter, setSortBy } = postsSlice.actions;
export default postsSlice.reducer;
