import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../store/slice/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { selectUser, selectUserConnected } from '../../store/selectors';

const PrivateRoute = ({ children, roles }) => {
    const user = useSelector(selectUser);
    const userConnected = useSelector((selectUserConnected));
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userConnected) {
            dispatch(getMe()).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [userConnected, dispatch]);

    if (loading) {
        return <div style={{
            textAlign: 'center',
            width: '100%'
        }}>
            <CircularProgress />
        </div>;
    }

    if (!user || (roles && !roles.includes(user?.role_name))) {
        return <Navigate to="/not-allowed" />;
    }

    return children;
};

export default PrivateRoute;
