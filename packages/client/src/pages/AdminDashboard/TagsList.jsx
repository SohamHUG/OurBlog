import * as React from 'react';
import * as Redux from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCategoriesError, selectTags, selectTagsStatus } from '../../store/selectors';
import { getTags, deleteTag } from '../../store/slice/categoriesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

const TagsList = () => {
    const dispatch = Redux.useDispatch();
    const tags = Redux.useSelector(selectTags);
    const status = Redux.useSelector(selectTagsStatus);
    const error = Redux.useSelector(selectCategoriesError);
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(getTags());

    }, []);


    const handleRemoveTag = (id) => {
        dispatch(deleteTag(id));
    }

    return (
        <section className="page-admin">
            <div className='header-page'>
                <ArrowBackIcon className="back-btn link" onClick={() => navigate(-1)} />
                <h2>Les Tags</h2>
            </div>
            {status === 'loading' &&
                <div>Loading</div>
            }

            {status === 'failed' &&
                <div style={{ textAlign: 'center' }} className='alert'>{error}</div>
            }

            {tags && tags.length > 0 &&
                <div className='categories-container'>
                    {tags.map((tag) => {
                        return (
                            <div key={tag.id} className='category'>
                                <span>{tag.name}</span>
                                <DeleteIcon className="delete-btn" onClick={() => handleRemoveTag(tag.id)} />
                            </div>

                        )

                    })}

                </div>
            }

        </section>
    );
};

export default TagsList;