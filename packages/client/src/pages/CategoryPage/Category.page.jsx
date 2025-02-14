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
} from '../../store/selectors';
import { fetchCategories, getTags } from '../../store/slice/categoriesSlice';
import {
    getPosts,
    setTagsFilter,
    setSortBy,
    resetCategoryPosts,
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
    const posts = Redux.useSelector((state) => state.posts.categoryPosts.items);
    const tags = Redux.useSelector((state) => state.categories.tags);
    const filters = Redux.useSelector((state) => state.posts.filters);
    const hasMore = Redux.useSelector((state) => state.posts.categoryPosts.hasMore);
    const page = Redux.useSelector((state) => state.posts.categoryPosts.page)
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }

        if (category && category.name) {
            dispatch(getTags({ category: category.name }))
        }

    }, [status, dispatch, category]);

    useEffect(() => {
        if (status === 'succeeded') {
            dispatch(getPosts({
                category: category.name,
                tags: selectedTags.join(','),
                sortBy: filters.sortBy,
                limit: 10,
                page,
                context: 'category',
            }))
        }

    }, [dispatch, status, category, page, posts]);


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

    // console.log(selectedTags)

    useEffect(() => {
        // setPage(1);
        dispatch(resetCategoryPosts());
    }, [filters.sortBy, selectedTags, dispatch]);

    return (
        <section className="category-page">
            <div className="header">
                <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                <h1>{category?.name}</h1>
            </div>

            <div className="filter-section">
                <select value={filters.sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))}>
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

            <PostsList posts={posts} />
            <InfiniteScroll context="category" isLoading={status === 'loading'} hasMore={hasMore} />
        </section>
    );
};

export default CategoryPage;
