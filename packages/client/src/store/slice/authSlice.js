import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData) => {

        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(userData),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();

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


export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/auth/logout', {
            method: 'GET',
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
        status: 'idle',
        errorLogin: null,
        errorRegister: null,
        errorLogout: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.errorRegister = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.user = action.payload.data;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                console.log(action)
                state.errorRegister = action.error.message;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.errorLogin = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userConnected = true;
                localStorage.setItem('user', JSON.stringify(true));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                // console.log(action.error)
                state.errorLogin = action.error.message;
            })
            .addCase(logout.fulfilled, (state) => {
                state.userConnected = null;
                state.errorLogin = null;
                state.errorRegister = null;
                state.errorLogout = null;
                localStorage.removeItem('user');
            })
            .addCase(logout.rejected, (state, action) => {
                state.errorLogout = action.payload || 'Logout failed';
            });
    },
});

export default authSlice.reducer;
