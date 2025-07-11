import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // TODO: tsconfig path

const AuthorizedRoute = () => {
  const auth = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AuthorizedRoute;
