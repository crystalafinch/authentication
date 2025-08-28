import { Routes, Route, useLocation } from 'react-router-dom';
import AuthorizedRoute from '../authorized-route/AuthorizedRoute';
import AuthLayout from '../auth-layout/AuthLayout';
import SignInForm from '../signin-form/SignInForm';
import CreateAccountForm from '../create-account-form/CreateAccountForm';
import Home from '../home/Home';
import PublicRoute from '../public-route/PublicRoute';
import Dashboard from '../dashboard/Dashboard';
import { useAuth } from '@/context/AuthContext';
import Profile from '../profile/Profile';

function AppRoutes() {
  const auth = useAuth();
  const location = useLocation();
  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
  return auth?.state.loading ? <></> : routes;
}

export default AppRoutes;
