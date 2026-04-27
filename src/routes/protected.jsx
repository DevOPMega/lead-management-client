import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    // 1. Show a loading spinner while the backend verifies the cookie
    if (isLoading) {
        return <div>Verifying session...</div>;
    }

    // 2. If verification fails(no user), redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If valid, render the requested route
    return <Outlet />;
};

export default ProtectedRoute;