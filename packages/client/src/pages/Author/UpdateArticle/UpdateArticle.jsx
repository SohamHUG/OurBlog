import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPost, updateArticle } from '../../../store/slice/articleSlice';
import ArticleForm from '../../../components/ArticleForm/ArticleForm';

const UpdateArticlePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { post, status, error } = useSelector((state) => state.posts)

    React.useEffect(() => {
        dispatch(getPost(id));
    }, [id]);

    console.log(status)

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
                tags: post.tags ? post.tags.split(', '): [],
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
        const articleUp = await dispatch(updateArticle({id: post.id, articleData: formData}))

        if (updateArticle.fulfilled.match(articleUp)) {
            // setNewId(article.payload.article);
            // setOpenModal(true);
            navigate(`/article/${articleUp.payload.article.id}`)
            // console.log(articleUp)
        }

    };

    // console.log(post)

    return (
        <>
            {status === 'loading' &&
                <div>Loading</div>
            }

            {status === 'failed' &&
                <div className='alert'>Post introuvable </div>
            }

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