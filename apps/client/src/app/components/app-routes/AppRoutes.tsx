import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AuthorizedRoute from '../authorized-route/AuthorizedRoute';
import AuthLayout from '../auth-layout/AuthLayout';
import SignInForm from '../signin-form/SignInForm';
import CreateAccountForm from '../create-account-form/CreateAccountForm';
import Home from '../home/Home';
import PublicRoute from '../public-route/PublicRoute';
import Research from '../research/Research';
import { useAuth } from '@/context/AuthContext';
import Build from '../build/Build';

function AppRoutes() {
  const auth = useAuth();
  const location = useLocation();
  const routes = (
    <Routes>
      <Route
        path="/"
        element={
          auth?.state.user ? (
            <Navigate to="/research" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
      <Route element={<PublicRoute />}>
        <Route
          path="signin"
          element={
            <AuthLayout>
              <SignInForm />
            </AuthLayout>
          }
        />
        <Route
          path="create-account"
          element={
            <AuthLayout>
              <CreateAccountForm />
            </AuthLayout>
          }
        />
      </Route>
      <Route
        element={
          <AuthorizedRoute user={auth?.state.user} location={location} />
        }
      >
        <Route path="/research" element={<Research />} />
        <Route path="/build" element={<Build />} />
      </Route>
    </Routes>
  );
  return auth?.state.loading ? <></> : routes;
}

export default AppRoutes;
