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
    async ({ id, userData }, { rejectWithValue }) => {
    try {
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
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        user: null,
        status: 'idle',
        error: null,
        errorUpdate: null,
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
                state.error = null;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;

            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(action)
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = "Session expirée, reconnectez-vous";
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
                state.errorUpdate = action.error.message;
            })
    },
});

export const { logoutUser } = usersSlice.actions;
export default usersSlice.reducer;