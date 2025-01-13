import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(userData),
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
    }
);

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    const data = await response.json();
    return data.data;
});

export const getUser = createAsyncThunk('auth/getUser', async (_, { rejectWithValue }) => {
    try {
        const url = `http://localhost:3000/auth/me`;

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

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:3000/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message);
            }

            const data = await response.json();
            console.log("Token refreshed successfully:", data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            credentials: 'include', // Pour inclure les cookies
        });

        if (!response.ok) {
            const error = await response.json();
            return rejectWithValue(error.message);
        }

        return response.json();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userConnected: localStorage.getItem('user') || null,
        user: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        // logoutUser: (state) => {
        //     state.user = null;
        //     localStorage.removeItem('user');
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.data;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userConnected = true;
                localStorage.setItem('user', JSON.stringify(true));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.user = null;
                state.userConnected = null;
                localStorage.removeItem('user');
                state.error = action.payload || action.error.message;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem('user');
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload || 'Logout failed';
            });
    },
});


// export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
