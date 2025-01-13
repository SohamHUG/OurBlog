import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { refreshToken } from '../store/slice/authSlice';

const useRefreshToken = () => {
    const dispatch = useDispatch();
    const timeoutRef = useRef(null);
    const lastActivityRef = useRef(Date.now());

    useEffect(() => {
        const handleActivity = () => {
            lastActivityRef.current = Date.now();
            // console.log("User activity detected, last activity time updated.");
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        timeoutRef.current = setInterval(() => {
            const timeSinceLastActivity = Date.now() - lastActivityRef.current;
            // console.log(`Time since last activity: ${timeSinceLastActivity / 1000} seconds`);

            if (timeSinceLastActivity < 55 * 60 * 1000) {
                console.log("Refreshing token...");
                dispatch(refreshToken());
            } else {
                console.log("No recent activity, token refresh skipped.");
            }
        }, 55 * 60 * 1000);

        // return () => {
        //     clearInterval(timeoutRef.current);
        //     window.removeEventListener('mousemove', handleActivity);
        //     window.removeEventListener('keydown', handleActivity);
        // };
    }, [dispatch]);
};

export default useRefreshToken;
