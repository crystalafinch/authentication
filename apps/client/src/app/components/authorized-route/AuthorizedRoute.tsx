import { Location, Navigate, Outlet } from 'react-router-dom';
import { User } from '@/context/AuthContext';

const AuthorizedRoute = ({
  user,
  location,
}: {
  user: User | null | undefined;
  location: Location;
}) => {
  if (user) {
    return <Outlet />;
  }

  return <Navigate to="/signin" replace state={{ from: location }} />;
};

export default AuthorizedRoute;
