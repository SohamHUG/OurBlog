// DarkMode
export const selectDarkMode = (state) => Boolean(state.theme.darkMode);


//All Articles 
export const selectAllArticles = (state) => state.articles.allArticles.items;
export const selectAllArticlesPage = (state) => state.articles.allArticles.page;
export const selectAllArticlesHasMore = (state) => state.articles.allArticles.hasMore;
export const selectAllArticlesStatus = (state) => state.articles.allArticles.status;
export const selectAllArticlesError = (state) => state.articles.allArticles.error;

//Author Articles 
export const selectAuthorArticles = (state) => state.articles.authorArticles.items;
export const selectAuthorArticlesPage = (state) => state.articles.authorArticles.page;
export const selectAuthorArticlesHasMore = (state) => state.articles.authorArticles.hasMore;
export const selectAuthorArticlesStatus = (state) => state.articles.authorArticles.status;
export const selectAuthorArticlesError = (state) => state.articles.authorArticles.error;

//Categorie Articles 
export const selectCategoryArticles = (state) => state.articles.categoryArticles.items;
export const selectCategoryArticlesPage = (state) => state.articles.categoryArticles.page;
export const selectCategoryArticlesHasMore = (state) => state.articles.categoryArticles.hasMore;
export const selectCategoryArticlesStatus = (state) => state.articles.categoryArticles.status;
export const selectCategoryArticlesError = (state) => state.articles.categoryArticles.error;

//Single Article 
export const selectArticle = (state) => state.articles.article;
export const selectArticleStatus = (state) => state.articles.status;
export const selectArticleError = (state) => state.articles.error;
//Filtres
export const selectFilters = (state) => state.articles.filters


//Auth
export const selectUserConnected = (state) => state.auth.userConnected;
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

//Users
export const selectUsersList = (state) => state.users.users;
export const selectProfil = (state) => state.users.profil;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

//Comments
export const selectComments = (state) => state.comments.comments;
export const selectCommentsStatus = (state) => state.comments.status;
export const selectCommentsError = (state) => state.comments.error;

//Photos
export const selectPhotosStatus = (state) => state.photos.status;
export const selectPhotosError = (state) => state.photos.error;

//Categories
export const selectCategories = (state) => state.categories.items;
export const selectCategoriesStatus = (state) => state.categories.status;
export const selectCategoriesError = (state) => state.categories.error;
//Tags
export const selectTags = (state) => state.categories.tags;
export const selectTagsStatus = (state) => state.categories.tagStatus;

//SearchResults
export const selectResults = (state) => state.search.results;
export const selectNavResults = (state) => state.search.navResults;