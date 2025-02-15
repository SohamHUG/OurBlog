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

        // console.log(file)
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

export const uploadArticlePic = createAsyncThunk(
    'photo/uploadArticlePic',
    async (file,) => {

        // console.log(file)
        const url = `http://localhost:3000/upload/article-files`;

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
        return data.url;

    }
);

export const uploadImagesAndUpdateContent = createAsyncThunk(
    'photo/uploadImagesAndUpdateContent',
    async ({ content }, { dispatch }) => {
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const images = [];
        let match;

        while ((match = imgRegex.exec(content)) !== null) {
            images.push(match[1]);
        }

        let updatedContent = content;

        for (const imageUrl of images) {
            if (imageUrl.startsWith('data:')) {
                const formData = new FormData();
                const blob = await fetch(imageUrl).then((res) => res.blob());
                formData.append('articleFile', blob);

                const response = await dispatch(uploadArticlePic(formData));
                const finalImageUrl = response.payload;

                updatedContent = updatedContent.replace(imageUrl, finalImageUrl);
            }
        }

        return updatedContent;
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
            .addCase(uploadArticlePic.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(uploadArticlePic.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(action)
            })
            .addCase(uploadArticlePic.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export default photosSlice.reducer;