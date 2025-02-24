import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:3000/users';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return response.json();
};

export const getPopularUsers = createAsyncThunk('user/getPopularUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${BASE_URL}/popular`, {
            method: 'GET',
        });
        return handleResponse(response).then((data) => data.users);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const getAllUsers = createAsyncThunk('user/getAllUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/users`, {
            method: 'GET',
            credentials: 'include',
        });
        return handleResponse(response).then((data) => data.users);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const getProfil = createAsyncThunk('user/getProfil', async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
        return handleResponse(response).then((data) => data.user);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateUser = createAsyncThunk('user/updateUser', async ({ id, userData }) => {
    const response = await fetch(`${BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
    });
    return handleResponse(response).then((data) => data.user);
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return handleResponse(response).then((data) => data.user);
});

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        profil: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        resetUsers: (state) => {
            state.users = [];
            state.status = 'idle'
        },
        resetProfil: (state) => {
            state.profil = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPopularUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getPopularUsers.fulfilled, (state, action) => {
                state.status = 'idle';
                state.users = action.payload;
            })
            .addCase(getPopularUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.meta.arg);
                state.status = 'succeeded';
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getProfil.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getProfil.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profil = action.payload;
            })
            .addCase(getProfil.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export const { resetUsers, resetProfil } = usersSlice.actions;
export default usersSlice.reducer;
