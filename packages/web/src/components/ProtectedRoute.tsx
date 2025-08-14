import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';

type ProtectedRouteProps = {
    // Optional role-based guard
    allowedRoles?: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    console.log({ isAuthenticated, user, allowedRoles });

    const location = useLocation();

    if (!isAuthenticated) {
        // Send them to /login and remember where they wanted to go
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const hasRole = user && allowedRoles.includes(user.role || '');
        if (!hasRole) {
            return <Navigate to="/forbidden" replace />;
        }
    }

    return <Outlet />; // Render children routes
};

export default ProtectedRoute;
