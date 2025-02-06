import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:3000/comments';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return response.json();
};

export const createComment = createAsyncThunk('comments/createComment', async ({ comment, id }) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
        credentials: 'include',
    });
    return handleResponse(response);
});

export const getComments = createAsyncThunk(
    "comments/getComments",
    async (filters, { rejectWithValue }) => {

        try {
            const response = await fetch(`${BASE_URL}?${new URLSearchParams(filters)}`);

            return handleResponse(response)
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        status: 'idle',
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(createComment.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.status = 'idle';
                state.comments.push(action.payload.comment[0]);
            })
            .addCase(createComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getComments.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.comments = action.payload.comments
            })
            .addCase(getComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

    },
});

export default commentSlice.reducer;
