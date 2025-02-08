import * as React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPost, updateArticle } from '../../../store/slice/articleSlice';
import ArticleForm from '../../../components/ArticleForm/ArticleForm';

const UpdateArticlePage = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.users);
    const { post, status, error } = useSelector((state) => state.posts)
    const dispatch = useDispatch();


    React.useEffect(() => {
        dispatch(getPost(id));
    }, [id, dispatch]);

    // console.log(status)
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        title: '',
        content: '',
        category: '',
        tags: [],
    });

    React.useEffect(() => {
        if (status === 'succeeded' && post) {
            setFormData({
                title: post.title || '',
                content: post.content,
                category: post.category_id || '',
                tags: post.tags ? post.tags.split(', ') : [],
            })
            // handleContentChange(post.content)
        }
    }, [status]);

    // console.log(formData)

    const handleTagsChange = (e) => {
        const input = e.target.value;
        const tagsArray = input.split('#');

        setFormData({ ...formData, tags: tagsArray });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };

    const handleContentChange = React.useCallback((content) => {
        setFormData((prevFormData) => ({ ...prevFormData, content }));
    }, [formData, setFormData]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const articleUp = await dispatch(updateArticle({ id: post.id, articleData: formData }))

        if (updateArticle.fulfilled.match(articleUp)) {
            // setNewId(article.payload.article);
            // setOpenModal(true);
            navigate(`/article/${articleUp.payload.article.id}`)
            // console.log(articleUp)
        }

    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div className='alert'>Post introuvable </div>
    }

    if (post && user && (post.user_id !== user.user_id && user.role_name !== 'admin')) {
        return <Navigate to="/not-allowed" />;
    }

    // console.log(post)

    return (
        <>
            {status === 'succeeded' && post &&
                <section>
                    <h2>Modifier l'article : {post.title}</h2>
                    <ArticleForm
                        formData={formData}
                        handleChange={handleChange}
                        handleContentChange={handleContentChange}
                        handleTagsChange={handleTagsChange}
                        handleSubmit={handleSubmit}
                    />
                </section>
            }
        </>)
};

export default UpdateArticlePage;