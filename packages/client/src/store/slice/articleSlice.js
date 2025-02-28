import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const getArticles = createAsyncThunk(
    "articles/getArticles",
    async (filters, { rejectWithValue }) => {
        try {
            // console.log(filters)
            const response = await fetch(`${API_URL}/articles?${new URLSearchParams(filters)}`);
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des posts.");
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getArticle = createAsyncThunk("articles/getArticle", async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/articles/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement du post.");
        return await response.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const createArticle = createAsyncThunk("articles/createArticle", async (articleData, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/articles/create-article`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(articleData),
            credentials: "include",
        });
        if (!response.ok) {
            const errorData = await response.json();
            // console.log(errorData)
            return rejectWithValue(errorData.message);
        }
        return await response.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateArticle = createAsyncThunk("articles/updateArticle", async ({ id, articleData }, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/articles/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(articleData),
            credentials: "include",
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

export const deleteArticle = createAsyncThunk("articles/deleteArticle", async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/articles/delete/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData.message);
        }
        // console.log(response)
        return response.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Slice
const articlesSlice = createSlice({
    name: "articles",
    initialState: {
        allArticles: { items: [], status: "idle", page: 1, hasMore: true, error: null },
        categoryArticles: { items: [], status: "idle", page: 1, hasMore: true, error: null },
        authorArticles: { items: [], status: "idle", page: 1, hasMore: true, error: null },
        article: null,
        status: 'idle',
        error: null,
        filters: { tags: [], sortBy: "famous" },
    },
    reducers: {
        setTagsFilter: (state, action) => {
            state.filters.tags = action.payload;
        },
        setSortBy: (state, action) => {
            state.filters.sortBy = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetArticle: (state, action ) => {
            state.article = null;
            state.status = 'idle';
            state.error = null;
        },
        resetArticles: (state, action) => {
            // console.log(action)
            const { context } = action.payload;
            if (context === 'all') state.allArticles = { items: [], status: "idle", page: 1, hasMore: true, error: null };
            else if (context === 'category') state.categoryArticles = { items: [], status: "idle", page: 1, hasMore: true, error: null };
            else if (context === 'author') state.authorArticles = { items: [], status: "idle", page: 1, hasMore: true, error: null };
        },
        incrementPage: (state, action) => {
            const { context } = action.payload;
            if (context === 'all' && state.allArticles.hasMore) state.allArticles.page += 1;
            else if (context === 'category' && state.categoryArticles.hasMore) state.categoryArticles.page += 1;
            else if (context === 'author' && state.authorArticles.hasMore) state.authorArticles.page += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            // GET POSTS
            .addCase(getArticles.pending, (state, action) => {
                const { context } = action.meta.arg;
                if (context === "category") state.categoryArticles.status = "loading";
                else if (context === "author") state.authorArticles.status = "loading";
                else if (context === "all") state.allArticles.status = "loading";
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                const { context } = action.meta.arg;
                const newPosts = action.payload.articles;
                if (context === "category") {
                    const existingIds = new Set(state.categoryArticles.items.map(post => post.id));

                    const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
                    state.categoryArticles.items.push(...uniqueNewPosts);

                    state.categoryArticles.status = "succeeded";
                    if (newPosts.length < 10) state.categoryArticles.hasMore = false;
                    else state.categoryArticles.hasMore = true;
                } else if (context === "author") {

                    const existingIds = new Set(state.authorArticles.items.map(post => post.id));

                    const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
                    state.authorArticles.items.push(...uniqueNewPosts);

                    state.authorArticles.status = "succeeded";
                    if (newPosts.length < 10) state.authorArticles.hasMore = false;
                    else state.authorArticles.hasMore = true;
                } else if (context === "all") {

                    const existingIds = new Set(state.allArticles.items.map(post => post.id));

                    const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
                    state.allArticles.items.push(...uniqueNewPosts);

                    state.allArticles.status = "succeeded";
                    if (newPosts.length < 10) state.allArticles.hasMore = false;
                    else state.allArticles.hasMore = true;
                }
            })
            .addCase(getArticles.rejected, (state, action) => {
                const { context } = action.meta.arg;
                if (context === "category") {
                    state.categoryArticles.status = "failed";
                    state.categoryArticles.error = action.payload;
                } else if (context === "author") {
                    state.authorArticles.status = "failed";
                    state.authorArticles.error = action.payload;
                } else if (context === "all") {
                    state.allArticles.status = "failed";
                    state.allArticles.error = action.payload;
                }
            })

            // GET SINGLE POST
            .addCase(getArticle.pending, (state) => {
                state.status = 'loading';
                state.article = null;
            })
            .addCase(getArticle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.article = action.payload.article;
            })
            .addCase(getArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.article = null;
                state.error = action.error.message
            })

            // CREATE POST
            .addCase(createArticle.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.status = "succeeded";
                if (state.filters.sortBy === 'recent') {
                    state.allArticles.items.unshift(action.payload.article);
                } else if (state.filters.sortBy === 'famous' && !state.allArticles.hasMore) {
                    state.allArticles.items.push(action.payload.article);
                }
                // state.allArticles.items.unshift(action.payload.article);
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })

            // UPDATE POST
            .addCase(updateArticle.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedPost = action.payload.article;
                state.allArticles.items = state.allArticles.items.map((post) =>
                    post.id === updatedPost.id ? updatedPost : post
                );
                state.categoryArticles.items = state.categoryArticles.items.map((post) =>
                    post.id === updatedPost.id ? updatedPost : post
                );
                state.authorArticles.items = state.authorArticles.items.map((post) =>
                    post.id === updatedPost.id ? updatedPost : post
                );
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })

            // DELETE POST
            .addCase(deleteArticle.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.status = "succeeded";

                state.allArticles.items = state.allArticles.items.filter((post) => post.id !== action.meta.arg);

                state.authorArticles.items = state.authorArticles.items.filter((post) => post.id !== action.meta.arg);

                state.categoryArticles.items = state.categoryArticles.items.filter((post) => post.id !== action.meta.arg);
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            });
    },
});

export const { setTagsFilter, setSortBy, resetArticles, incrementPage, resetArticle } = articlesSlice.actions;
export default articlesSlice.reducer;
