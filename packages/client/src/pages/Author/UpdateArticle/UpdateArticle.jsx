import * as React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPost, updateArticle } from '../../../store/slice/articleSlice';
import ArticleForm from '../../../components/ArticleForm/ArticleForm';
import { uploadImagesAndUpdateContent } from '../../../store/slice/photoSlice.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';


const UpdateArticlePage = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const { post, status, error } = useSelector((state) => state.posts)
    const [errorMessage, setErrorMessage] = React.useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    React.useEffect(() => {
        dispatch(getPost(id));
    }, [id, dispatch]);

    // console.log(status)

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

    // console.log(post.content)

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

        if (!formData.title.trim() ||
            !formData.category ||
            !formData.content.replace(/<[^>]+>/g, '').trim()) {

            setErrorMessage("Veuillez remplir tous les champs obligatoires (titre, catégorie, contenu)");
            return;
        }

        setErrorMessage("");

        try {
            const updatedContent = await dispatch(uploadImagesAndUpdateContent({ content: formData.content })).unwrap();
            const updatedFormData = { ...formData, content: updatedContent };

            const articleUp = await dispatch(updateArticle({ id: post.id, articleData: updatedFormData }))

            if (updateArticle.fulfilled.match(articleUp)) {
                navigate(`/article/${articleUp.payload.article.id}`)
            }
        } catch (error) {
            console.error('Erreur lors du téléchargement des images :', error);
            setErrorMessage("Une erreur s'est produite lors du téléchargement des images.");
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

    return (
        <>
            {status === 'succeeded' && post &&
                <section>
                    <div className='header'
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #eee',
                            justifyContent: 'space-around',
                            padding: '0 .5em'
                        }}
                    >
                        <ArrowBackIcon className='link back-btn' onClick={goBack} />
                        <h2 style={{ textAlign: 'center', flex: '1' }}>Modifier l'article : {post.title}</h2>
                    </div>
                    <ArticleForm
                        formData={formData}
                        handleChange={handleChange}
                        handleContentChange={handleContentChange}
                        handleTagsChange={handleTagsChange}
                        handleSubmit={handleSubmit}
                        errorMessage={error || errorMessage}
                    />
                </section>
            }
        </>)
};

export default UpdateArticlePage;