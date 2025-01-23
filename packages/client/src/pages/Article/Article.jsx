import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPost } from '../../store/slice/articleSlice';
import PostContent from '../../components/PostContent/PostContent';

const Article = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const { post, statusPost, errorPost } = useSelector((state) => state.posts)

    React.useEffect(() => {

        dispatch(getPost(id))

    }, [id, dispatch]);

    return (
        <>
            {statusPost === 'loading' &&
                <div>Loading</div>
            }

            {statusPost === 'failed' &&
                <div className='alert'>{errorPost}</div>
            }

            {statusPost === 'succeeded' &&
                <div>
                    <PostContent
                        content={post.content}
                    />
                </div>
            }
        </>
    );
};

export default Article;