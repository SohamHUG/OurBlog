import React, { useEffect, useState } from 'react';
import * as Redux from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostsList from '../../components/PostsList/PostsList';
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll';
import {
    selectCategories,
    selectCategoriesStatus,
    selectCategoriesError,
    selectCategoryArticles,
    selectCategoryArticlesStatus,
    selectTags,
    selectTagsStatus,
    selectFilters,
    selectCategoryArticlesHasMore,
    selectCategoryArticlesPage,
} from '../../store/selectors';
import { fetchCategories, getTags } from '../../store/slice/categoriesSlice';
import {
    getArticles,
    setTagsFilter,
    setSortBy,
    resetArticles,
} from '../../store/slice/articleSlice';
import './CategoryPage.scss';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const dispatch = Redux.useDispatch();
    const navigate = useNavigate();
    const category = Redux.useSelector(selectCategories).find(
        (cat) => cat.id === Number(categoryId)
    );
    const status = Redux.useSelector(selectCategoriesStatus);
    const posts = Redux.useSelector(selectCategoryArticles);
    const postsStatus = Redux.useSelector(selectCategoryArticlesStatus);
    const tags = Redux.useSelector(selectTags);
    const tagsStatus = Redux.useSelector(selectTagsStatus);
    const filters = Redux.useSelector(selectFilters);
    const hasMore = Redux.useSelector(selectCategoryArticlesHasMore);
    const page = Redux.useSelector((selectCategoryArticlesPage))
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }

        if (category && category.name) {
            dispatch(getTags({ category: category.name }));
            dispatch(resetArticles({ context: 'category' }))
        }

    }, [status, dispatch, category]);

    useEffect(() => {
        if (tagsStatus === 'succeeded') {
            // console.log(filters)
            dispatch(getArticles({
                category: category.name,
                tags: selectedTags.join(','),
                sortBy: filters.sortBy,
                limit: 10,
                page,
                context: 'category',
            }))
        }

    }, [dispatch, category, page, posts, tagsStatus]);


    const handleTagChange = (tag) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];
        setSelectedTags(newTags);
        dispatch(setTagsFilter(newTags));
    };

    const handleSortChange = (event) => {
        const sortBy = event.target.value;
        dispatch(setSortBy(sortBy));
    };

    // console.log(posts)

    useEffect(() => {
        // setPage(1);
        dispatch(resetArticles({ context: 'category' }));
    }, [filters.sortBy, selectedTags, dispatch]);

    return (
        <section className="category-page">
            <div className="header">
                <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                <h1>{category?.name}</h1>
            </div>

            <div className="filter-section">
                <select name='sortBy' value={filters.sortBy} onChange={(e) => handleSortChange(e)}>
                    <option value="recent">Les plus récents</option>
                    <option value="famous">Les plus populaires</option>
                </select>
                <div className="tags">
                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            className={`tag ${selectedTags.includes(tag.name) ? 'active' : ''}`}
                            onClick={() => handleTagChange(tag.name)}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
            </div>

            {posts && posts.length > 0 ?
                <>
                    <PostsList posts={posts} />
                    <InfiniteScroll context="category" isLoading={postsStatus === 'loading'} hasMore={hasMore} />
                </>
                : <h3>Aucun article pour la catégorie {category?.name}</h3>
            }

        </section>
    );
};

export default CategoryPage;
