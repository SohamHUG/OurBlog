import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

export const uploadProfilPic = createAsyncThunk(
    'photo/uploadProfilPic',
    async (file,) => {

        // console.log(file)
        const url = `${API_URL}/upload/profil-picture`;

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
        const url = `${API_URL}/upload/article-files`;

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
        return data;

    }
);

export const uploadImagesAndUpdateContent = createAsyncThunk(
    'photo/uploadImagesAndUpdateContent',
    async ({ content }, { dispatch }) => {
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const images = [];
        let match;
        const imagesId = [];

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
                // console.log(response)
                const finalImageUrl = response.payload.url;
                imagesId.push(response.payload.publicId)
                updatedContent = updatedContent.replace(imageUrl, finalImageUrl);
            }
        }

        // console.log(imagesId)

        return {updatedContent, imagesId};
    }
);

export const deleteProfilPic = createAsyncThunk(
    'user/uploadProfilPic',
    async (id) => {

        const url = `${API_URL}/upload/profil-picture/${id}`;

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
        status: 'idle',
        error: null,
    },
    reducers: {


    },
    extraReducers: (builder) => {
        builder
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
            .addCase(deleteProfilPic.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteProfilPic.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(action)
            })
            .addCase(deleteProfilPic.rejected, (state, action) => {
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