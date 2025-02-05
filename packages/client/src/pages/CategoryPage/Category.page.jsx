import * as React from 'react';
import * as Redux from 'react-redux';
import { selectCategories, selectCategoriesStatus, selectCategoriesError } from '../../store/selectors';
import { fetchCategories, getTags } from '../../store/slice/categoriesSlice';
import { getPosts, setTagsFilter, setSortBy } from '../../store/slice/articleSlice';
import { useParams } from 'react-router-dom';
import PostsList from '../../components/PostsList/PostsList';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const dispatch = Redux.useDispatch()
    const category = Redux.useSelector(selectCategories).find((category) => category.id === Number(categoryId));
    const status = Redux.useSelector(selectCategoriesStatus);
    const statusPost = Redux.useSelector((state) => state.posts.status);
    const posts = Redux.useSelector((state) => state.posts.posts)
    const tags = Redux.useSelector((state) => state.categories.tags)
    const filters = Redux.useSelector((state) => state.posts.filters)
    const error = Redux.useSelector(selectCategoriesError);
    const [selectedTags, setSelectedTags] = React.useState([]);

    React.useEffect(() => {
        dispatch(getTags())
    }, [])

    React.useEffect(() => {

        if (status === 'idle') {
            dispatch(fetchCategories());
        }
        if (status === 'succeeded') {
            dispatch(getPosts({
                category: category.name,
                tags: selectedTags.join(','),
                sortBy: filters.sortBy,
            }))
        }

    }, [status, dispatch, category, selectedTags, filters.sortBy]);

    const handleTagChange = (tag) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag) // Désélectionner le tag
            : [...selectedTags, tag]; // Ajouter le tag
        setSelectedTags(newTags);
        dispatch(setTagsFilter(newTags));
    };

    const handleSortChange = (event) => {
        const sortBy = event.target.value;
        dispatch(setSortBy(sortBy));
    };

    return (
        <>
            {status === 'loading' &&
                <div>Loading</div>
            }

            {status === 'failed' &&
                <div>{error}</div>
            }

            {status === 'succeeded' && statusPost === 'succeeded' &&
                <div>
                    <h1>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h1>
                    <select onChange={handleSortChange}>
                        <option value="recent">Les plus récents</option>
                        <option value="famous">Les plus populaires</option>
                    </select>

                    <div>
                        <h3>Filtrer par tags :</h3>
                        {tags.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => handleTagChange(tag.name)}
                                style={{
                                    backgroundColor: selectedTags.includes(tag.name) ? '#235AF3' : '#ccc',
                                    color: selectedTags.includes(tag.name) ? '#fff' : '#000',
                                    margin: '5px',
                                    padding: '5px 10px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                    {posts.length <= 0 && <h3>Aucun article</h3>}
                    <PostsList posts={posts} />

                </div>
            }
        </>
    );
};

export default CategoryPage;