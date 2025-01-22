import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk pour récupérer les posts
// export const fetchPosts = createAsyncThunk(
//     "posts/fetchPosts",
//     async (page, { rejectWithValue }) => {
//         try {
//             const response = await fetch(
//                 `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
//             );
//             if (!response.ok) {
//                 throw new Error("Erreur lors du chargement des posts.");
//             }
//             // console.log(response);
//             return await response.json();
//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async (page, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
            );
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des posts.");
            }
            // console.log(response);
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getTags = createAsyncThunk(
    "posts/getTags",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `http://localhost:3000/tags`
            );
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des tags.");
            }
            // console.log(response);
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createPost = createAsyncThunk('posts/createPost', async (articleData, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/article/create-article', {
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
        items: [],
        tags: [],
        page: 1,
        loading: true,
        error: null,
        errorTags: null,
        status: "first",
        statusGetTags: "idle",
        hasMore: true, // Indique s'il reste des posts à charger
    },
    reducers: {
        incrementPage: (state) => {
            console.log("Incrémentation de la page : ", state.page + 1);
            state.page += 1;
        },
    },
    extraReducers: (builder) => {
        builder
            // .addCase(fetchPosts.pending, (state) => {
            //     state.loading = true; // Début du chargement
            // })
            // .addCase(fetchPosts.fulfilled, (state, action) => {
            //     const newPosts = action.payload.filter(
            //         (post) =>
            //             !state.items.find((existing) => existing.id === post.id)
            //     );

            //     if (newPosts.length > 0) {
            //         state.loading = false; // Fin du chargement
            //         console.log("Nouveaux posts chargés:", newPosts);
            //         state.items = [...state.items, ...newPosts];
            //         // state.hasMore = newPosts.length > 0; // Arrête de charger s'il n'y a plus de données
            //         state.status = "succeeded";
            //         state.hasMore = true;
            //     } else {
            //         console.log("aucun post");
            //         state.hasMore = false;
            //         state.status = "empty";
            //     }
            // })
            // .addCase(fetchPosts.rejected, (state, action) => {
            //     state.loading = false; // Fin du chargement même en cas d'échec
            //     state.status = "failed";
            //     state.error = action.payload;
            // })
            .addCase(createPost.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.items.push(action.payload.data);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getTags.pending, (state) => {
                state.statusGetTags = 'loading';
                state.errorTags = null;
            })
            .addCase(getTags.fulfilled, (state, action) => {
                state.statusGetTags = 'succeeded';
                // state.items.push(action.payload.data);
                // console.log(action)
                state.tags = action.payload.data;
            })
            .addCase(getTags.rejected, (state, action) => {
                state.statusGetTags = 'failed';
                state.errorTags = action.error.message;
            });
    },
});

export const { incrementPage } = postsSlice.actions;

export default postsSlice.reducer;
