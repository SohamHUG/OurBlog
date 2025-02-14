import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, roles }) => {
    const user = useSelector((state) => state.auth.user);

    if (!user || roles && !roles.includes(user.role_name)) {
        return <Navigate to="/not-allowed" />;
    }

    return children;
};

export default PrivateRoute;
