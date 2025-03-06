import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementPage } from '../../store/slice/articleSlice';

const InfiniteScroll = ({ context, isLoading, hasMore }) => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100 &&
                !isLoading &&
                hasMore
            ) {
                dispatch(incrementPage({ context }));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore, context, dispatch]);

    return null;
};

export default InfiniteScroll;
