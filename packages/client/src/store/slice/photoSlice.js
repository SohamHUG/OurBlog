import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const searchPhotos = createAsyncThunk('users/searchPhotos', async () => {
  let url = 'https://jsonplaceholder.typicode.com/photos';
  const response = await fetch(url);
  const data = await response.json();
  return data;
})

export const uploadProfilPic = createAsyncThunk(
  'photo/uploadProfilPic',
  async (file,) => {

      const url = `http://localhost:3000/upload/profil-picture`;

      const response = await fetch(url, {
          method: 'POST',
          body: file,
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

export const deleteProfilPic = createAsyncThunk(
  'user/uploadProfilPic',
  async (id) => {

      const url = `http://localhost:3000/upload/profil-picture/${id}`;

      const response = await fetch(url, {
          method: 'DELETE',
          // body: file,
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
      .addCase(uploadProfilPic.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadProfilPic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // console.log(action)
      })
      .addCase(uploadProfilPic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default photosSlice.reducer;