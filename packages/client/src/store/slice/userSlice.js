import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const searchUsers = createAsyncThunk('users/searchUsers', async () => {
    let url = 'https://jsonplaceholder.typicode.com/users';
    const response = await fetch(url);
    const data = await response.json();
    return data;
})

export const getUser = createAsyncThunk('user/getUser', async (_, { rejectWithValue }) => {
    try {
        const url = `http://localhost:3000/users/me`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        return data.user;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ id, userData }) => {

        const url = `http://localhost:3000/users/update/${id}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        const data = await response.json();
        return data.user;

    }
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (id) => {

        const url = `http://localhost:3000/users/${id}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        const data = await response.json();
        return data.user;

    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        user: null,
        status: 'idle',
        errorUsers: null,
        errorUser: null,
        errorUpdate: null,
        errorDelete: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchUsers.pending, (state) => {
                state.status = 'loading';
                state.errorUsers = null;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;

            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.errorUsers = action.error.message;
            })
            .addCase(getUser.pending, (state) => {
                state.status = 'loading';
                state.errorUser = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(action)
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = 'failed';
                state.errorUser = "Session expirée, reconnectez-vous";
                localStorage.removeItem('user');
            })
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
                state.errorUpdate = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(action)
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                // console.log(action.error)
                state.errorUpdate = action.error.message;
            })
            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
                state.errorDelete = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = null;
                localStorage.removeItem('user');
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                console.log(action.error)
                state.errorDelete = action.error.message;
            })
    },
});

export const { logoutUser } = usersSlice.actions;
export default usersSlice.reducer;