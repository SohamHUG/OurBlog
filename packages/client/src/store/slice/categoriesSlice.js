import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCategories = createAsyncThunk('categories/searchCategories', async () => {
    let url = `${API_URL}/categories`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erreur lors du chargement des catégories.");
    }
    const data = await response.json();
    return data.data;
});

export const createCategory = createAsyncThunk('categories/createCategory', async (name, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/admin/create-category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ name }),
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

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/admin/delete-category/${id}`, {
            method: 'DELETE',
            credentials: 'include',
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

export const getTags = createAsyncThunk(
    "categories/getTags",
    async (filters, { rejectWithValue }) => {

        try {
            const response = await fetch(`${API_URL}/tags?${new URLSearchParams(filters)}`);

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des posts.");
            }

            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteTag = createAsyncThunk('categories/deleteTag', async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/admin/delete-tag/${id}`, {
            method: 'DELETE',
            credentials: 'include',
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


const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        items: [],
        tags: [],
        status: 'idle',
        tagStatus: 'idle',
        error: null,
    },
    reducers: {


    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createCategory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items.push(action.payload.data);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const deletedId = action.meta.arg;
                state.items = state.items.filter((category) => category.id !== deletedId);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getTags.pending, (state) => {
                state.tagStatus = 'loading';
                state.error = null;
            })
            .addCase(getTags.fulfilled, (state, action) => {
                state.tagStatus = 'succeeded';
                state.tags = action.payload.tags;
            })
            .addCase(getTags.rejected, (state, action) => {
                state.tagStatus = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteTag.pending, (state) => {
                state.tagStatus = 'loading';
                state.error = null;
            })
            .addCase(deleteTag.fulfilled, (state, action) => {
                state.tagStatus = 'succeeded';
                const deletedId = action.meta.arg;
                state.tags = state.tags.filter((tag) => tag.id !== deletedId);
            })
            .addCase(deleteTag.rejected, (state, action) => {
                state.tagStatus = 'failed';
                state.error = action.error.message;
            })
    },
});

export default categoriesSlice.reducer;