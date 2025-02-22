import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementPage } from '../../store/slice/articleSlice';

// const InfiniteScroll = ({ context, isLoading, hasMore }) => {
//     const dispatch = useDispatch();
//     const page = useSelector((state) => state.articles[`${context}Posts`].page);
//     const observerRef = useRef(null);
//     const isProcessingRef = useRef(false); // Empêche les déclenchements multiples

//     useEffect(() => {
//         if (isLoading || !hasMore) {
//             isProcessingRef.current = true;
//         } else {
//             isProcessingRef.current = false;
//         }
//     }, [isLoading, hasMore]);

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 // console.log(isProcessingRef.current)
//                 if (entries[0].isIntersecting && !isProcessingRef.current) {
//                     // console.log("Observer déclenché");

//                     dispatch(incrementPage({ context }));
//                     isProcessingRef.current = true; // Empêche d'autres déclenchements avant le prochain chargement
//                 }
//             },
//             { threshold: 0.5 }
//         );

//         if (observerRef.current) observer.observe(observerRef.current);

//         return () => {
//             if (observerRef.current) observer.unobserve(observerRef.current);
//         };
//     }, [dispatch, context]);

//     return (
//         <div
//             ref={observerRef}
//             style={{
//                 height: "5px",
//                 background: "transparent",
//             }}
//         />
//     );
// };

const InfiniteScroll = ({ context, isLoading, hasMore }) => {
    const dispatch = useDispatch();
    // const page = useSelector((state) => state.articles[`${context}Posts`].page);

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
