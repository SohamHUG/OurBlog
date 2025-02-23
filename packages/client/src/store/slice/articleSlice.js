import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getArticles = createAsyncThunk(
    "articles/getArticles",
    async (filters, { rejectWithValue }) => {
        try {
            // console.log(filters)
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

export const getArticle = createAsyncThunk("articles/getArticle", async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`http://localhost:3000/articles/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement du post.");
        return await response.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const createArticle = createAsyncThunk("articles/createArticle", async (articleData, { rejectWithValue }) => {
    try {
        const response = await fetch("http://localhost:3000/articles/create-article", {
            method: "POST",
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

export const updateArticle = createAsyncThunk("articles/updateArticle", async ({ id, articleData }, { rejectWithValue }) => {
    try {
        const response = await fetch(`http://localhost:3000/articles/update/${id}`, {
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
        const response = await fetch(`http://localhost:3000/articles/delete/${id}`, {
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
        allPosts: { items: [], status: "idle", page: 1, hasMore: true, error: null },
        categoryPosts: { items: [], status: "idle", page: 1, hasMore: true, error: null },
        authorPosts: { items: [], status: "idle", page: 1, hasMore: true, error: null },
        post: null,
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
        resetCategoryPosts: (state) => {
            state.categoryPosts = { items: [], status: "idle", page: 1, hasMore: true, error: null };
        },
        resetAuthorPosts: (state) => {
            state.authorPosts = { items: [], status: "idle", page: 1, hasMore: true, error: null };
        },
        resetAllPosts: (state, action) => {
            // console.log(action)
            state.allPosts = { items: [], status: "idle", page: 1, hasMore: true, error: null };
        },
        incrementPage: (state, action) => {
            // console.log(state.allPosts.page)
            if (action.payload.context === 'all') state.allPosts.page += 1;
            else if (action.payload.context === 'category') state.categoryPosts.page += 1;
            else if (action.payload.context === 'author') state.authorPosts.page += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            // GET POSTS
            .addCase(getArticles.pending, (state, action) => {
                const { context } = action.meta.arg;
                if (context === "category") state.categoryPosts.status = "loading";
                else if (context === "author") state.authorPosts.status = "loading";
                else if (context === "all") state.allPosts.status = "loading";
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                const { context } = action.meta.arg;
                const newPosts = action.payload.articles;
                if (context === "category") {
                    // console.log(newPosts)
                    newPosts.forEach(post => {
                        if (!state.categoryPosts.items.find(existingPost => existingPost.id === post.id)) {
                            state.categoryPosts.items.push(post);
                        }
                    });
                    state.categoryPosts.status = "succeeded";
                    if (newPosts.length < 10) state.categoryPosts.hasMore = false;
                    else state.categoryPosts.hasMore = true;
                } else if (context === "author") {
                    newPosts.forEach(post => {
                        if (!state.authorPosts.items.find(existingPost => existingPost.id === post.id)) {
                            state.authorPosts.items.push(post);
                        }
                    });
                    // state.authorPosts.items = newPosts
                    state.authorPosts.status = "succeeded";
                    if (newPosts.length < 10) state.authorPosts.hasMore = false;
                    else state.authorPosts.hasMore = true;
                } else if (context === "all") {
                    // console.log(newPosts)
                    newPosts.forEach(post => {
                        if (!state.allPosts.items.find(existingPost => existingPost.id === post.id)) {
                            state.allPosts.items.push(post);
                        }
                    });
                    state.allPosts.status = "succeeded";
                    if (newPosts.length < 10) state.allPosts.hasMore = false;
                    else state.allPosts.hasMore = true;
                }
            })
            .addCase(getArticles.rejected, (state, action) => {
                const { context } = action.meta.arg;
                if (context === "category") {
                    state.categoryPosts.status = "failed";
                    state.categoryPosts.error = action.payload;
                } else if (context === "author") {
                    state.authorPosts.status = "failed";
                    state.authorPosts.error = action.payload;
                } else if (context === "all") {
                    state.allPosts.status = "failed";
                    state.allPosts.error = action.payload;
                }
            })

            // GET SINGLE POST
            .addCase(getArticle.pending, (state) => {
                state.status = 'loading';
                state.post = null;
            })
            .addCase(getArticle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.post = action.payload.article;
            })
            .addCase(getArticle.rejected, (state, action) => {
                state.status = 'failed';
                state.post = null;
                state.error = action.error.message
            })

            // CREATE POST
            .addCase(createArticle.pending, (state) => {
                state.allPosts.status = "loading";
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.allPosts.status = "succeeded";
                if (state.filters.sortBy === 'recent') {
                    state.allPosts.items.unshift(action.payload.article);
                } else if (!state.allPosts.hasMore) {
                    state.allPosts.items.push(action.payload.article);
                }
                // state.allPosts.items.unshift(action.payload.article);
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.allPosts.status = "failed";
                // state.allPosts.error = action.payload;
                state.error = action.error.message
            })

            // UPDATE POST
            .addCase(updateArticle.pending, (state) => {
                state.allPosts.status = "loading";
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.allPosts.status = "succeeded";
                const updatedPost = action.payload.article;
                state.allPosts.items = state.allPosts.items.map((post) =>
                    post.id === updatedPost.id ? updatedPost : post
                );
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.allPosts.status = "failed";
                state.allPosts.error = action.payload;
                state.error = action.error.message
            })

            // DELETE POST
            .addCase(deleteArticle.pending, (state) => {
                state.allPosts.status = "loading";
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.allPosts.status = "succeeded";
                state.authorPosts.status = "succeeded";
                state.categoryPosts.status = "succeeded";

                state.allPosts.items = state.allPosts.items.filter((post) => post.id !== action.meta.arg);

                state.authorPosts.items = state.authorPosts.items.filter((post) => post.id !== action.meta.arg);

                state.categoryPosts.items = state.categoryPosts.items.filter((post) => post.id !== action.meta.arg);
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.allPosts.status = "failed";
                state.allPosts.error = action.payload;
            });
    },
});

export const { setTagsFilter, setSortBy, resetCategoryPosts, resetAuthorPosts, resetAllPosts, incrementPage } = articlesSlice.actions;
export default articlesSlice.reducer;
