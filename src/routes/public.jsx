import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Prevent flickering
    }

    // If user is logged in, send them away from the login page
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    // If no user, show the Login/Register page
    return <Outlet />;
};

export default PublicRoute;
