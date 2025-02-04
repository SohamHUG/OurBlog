import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPost } from '../../../store/slice/articleSlice';
import ArticleForm from '../../../components/ArticleForm/ArticleForm';

const UpdateArticlePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { post, status, error } = useSelector((state) => state.posts)

    React.useEffect(() => {
        dispatch(getPost(id));
    }, [id]);

    // console.log(post)

    const [formData, setFormData] = React.useState({
        title: '',
        content: '',
        category: '',
        tags: [],
    });

    React.useEffect(() => {
        if (status === 'succeeded') {
            setFormData({
                title: post.title || '',
                content: post.content,
                category: post.category_id || '',
                tags: [],
            })
            // handleContentChange(post.content)
        }
    }, [status,]);

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
        // const article = await dispatch(createPost(formData));

        // if (createPost.fulfilled.match(article)) {
        //     setNewId(article.payload.article);
        //     setOpenModal(true);
        // }

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