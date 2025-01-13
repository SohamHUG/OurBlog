import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const searchPhotos = createAsyncThunk('users/searchPhotos', async () => {
  let url = 'https://jsonplaceholder.typicode.com/photos';
  const response = await fetch(url);
  const data = await response.json();
  return data;
})


const photosSlice = createSlice({
  name: 'photos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    

  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPhotos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(searchPhotos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default photosSlice.reducer;