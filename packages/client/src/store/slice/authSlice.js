import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteUser, updateUser } from './userSlice';
import { deleteProfilPic } from './photoSlice';

const BASE_URL = 'http://localhost:3000/auth';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return response.json();
};

export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
    });
    return handleResponse(response);
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    const data = await handleResponse(response);
    return data.data;
});

export const sendEmailConfirm = createAsyncThunk(
    'auth/sendEmailConfirm',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/confirm-email`, {
                method: 'POST',
                credentials: 'include',
            });
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const sendContact = createAsyncThunk(
    'auth/sendContact',
    async (formContact, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formContact),
                // credentials: 'include',
            });
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: 'GET',
                credentials: 'include',
            });
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getMe = createAsyncThunk('user/getMe', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`http://localhost:3000/users/me`, {
            method: 'GET',
            credentials: 'include',
        });
        return handleResponse(response).then((data) => data.user);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userConnected: JSON.parse(localStorage.getItem('user')) || null,
        user: null,
        status: 'idle',
        error: null,
        modalLogin: false,
    },
    reducers: {
        openModalLogin: (state) => {
            state.modalLogin = true;
        },
        closeModalLogin: (state) => {
            state.modalLogin = false;
        },
        logoutUser: (state) => {
            // state.user = null;
        },
        setErrorMessage: (state, action) => {
            state.error = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.status = 'idle';
                state.userConnected = true;
                localStorage.setItem('user', JSON.stringify(true));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(sendEmailConfirm.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(sendEmailConfirm.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(sendEmailConfirm.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(sendContact.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(sendContact.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(sendContact.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'idle';
                state.userConnected = null;
                state.user = null;
                localStorage.removeItem('user');
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Logout failed';
            })
            .addCase(getMe.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.status = 'idle';
                // console.log(action.payload)
                state.user = action.payload;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = 'Session expirée, reconnectez-vous';
                // console.log(action)
                // state.error = action.error.message
                state.user = null;
                // localStorage.removeItem('user');
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                if (state.userConnected && state.user.user_id === action.meta.arg) {
                    state.userConnected = null;
                    state.user = null;
                    localStorage.removeItem('user');
                    state.status = 'succeeded';
                }
            })
    },
});

export const { openModalLogin, closeModalLogin, logoutUser, setErrorMessage, setStatus } = authSlice.actions;
export default authSlice.reducer;
