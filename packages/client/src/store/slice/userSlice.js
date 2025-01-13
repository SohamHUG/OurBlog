import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const searchUsers = createAsyncThunk('users/searchUsers', async () => {
  let url = 'https://jsonplaceholder.typicode.com/users';
  const response = await fetch(url);
  const data = await response.json();
  return data;
})


const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    

  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;

      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default usersSlice.reducer;