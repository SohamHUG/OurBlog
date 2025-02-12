import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { incrementPage } from '../../store/slice/articleSlice';

const InfiniteScroll = ({ context, isLoading, hasMore }) => {
    const dispatch = useDispatch();
    const observerRef = useRef(null);
    const isProcessingRef = useRef(false); // Empêche les déclenchements multiples

    useEffect(() => {
        if (isLoading || !hasMore) {
            isProcessingRef.current = true;
        } else {
            isProcessingRef.current = false;
        }
    }, [isLoading, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isProcessingRef.current) {
                    console.log("Observer déclenché");
                    dispatch(incrementPage({ context }));
                    isProcessingRef.current = true; // Empêche d'autres déclenchements avant le prochain changement de `isLoading`
                }
            },
            { threshold: 0.5 }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [dispatch, context]);

    return (
        <div
            ref={observerRef}
            style={{
                height: "5px",
                background: "transparent",
            }}
        />
    );
};

export default InfiniteScroll;
