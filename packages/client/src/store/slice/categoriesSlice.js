import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCategories = createAsyncThunk('categories/searchCategories', async (id) => {
    let url = 'http://localhost:3000/categories';

    if (id) {
        url += '/' + id;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data.data;
});

export const createCategory = createAsyncThunk('categories/createCategory', async (name, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/admin/create-category', {
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
        const response = await fetch(`http://localhost:3000/admin/delete-category/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
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
        status: 'idle',
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
    },
});

export default categoriesSlice.reducer;