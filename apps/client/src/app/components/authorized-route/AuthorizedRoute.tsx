import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AuthorizedRoute = () => {
  const auth = useAuth();

  if (!auth?.user) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

export default AuthorizedRoute;
