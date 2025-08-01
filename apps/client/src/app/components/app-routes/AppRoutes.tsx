import { Routes, Route } from 'react-router-dom';
import AuthorizedRoute from '../authorized-route/AuthorizedRoute';
import AuthLayout from '../auth-layout/AuthLayout';
import SignInForm from '../signin-form/SignInForm';
import CreateAccountForm from '../create-account-form/CreateAccountForm';
import Home from '../home/Home';
import PublicRoute from '../public-route/PublicRoute';
import Dashboard from '../dashboard/Dashboard';
import { useAuth } from '@/app/context/AuthContext';
import Profile from '../profile/Profile';

function AppRoutes() {
  const auth = useAuth();
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
      <Route element={<AuthorizedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
  return auth?.loading ? <></> : routes;
}

export default AppRoutes;
