export const selectDarkMode = (state) => Boolean(state.theme.darkMode);

//Posts
export const selectPosts = (state) => state.posts.items;
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;

//Users
export const selectUsers = (state) => state.users.items;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

//Photos
export const selectPhotos = (state) => state.photos.items;
export const selectPhotosStatus = (state) => state.photos.status;
export const selectPhotosError = (state) => state.photos.error;

//Categories
export const selectCategories = (state) => state.categories.items;
export const selectCategoriesStatus = (state) => state.categories.status;
export const selectCategoriesError = (state) => state.categories.error;
