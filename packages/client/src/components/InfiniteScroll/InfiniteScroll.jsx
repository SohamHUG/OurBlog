import React, { useEffect } from 'react';

const InfiniteScroll = ({ onLoadMore, isLoading, hasMore }) => {
    // console.log(onLoadMore, isLoading, hasMore)
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                !isLoading &&
                hasMore
            ) {
                onLoadMore();
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading, hasMore, onLoadMore]);

    // return null;
};

export default InfiniteScroll;
