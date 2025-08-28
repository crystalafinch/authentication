import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PublicRoute = () => {
  const auth = useAuth();

  if (auth?.state.user) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PublicRoute;
