import { Routes, Route } from 'react-router-dom';
import AuthorizedRoute from '../authorized-route/AuthorizedRoute';
import AuthLayout from '../auth-layout/AuthLayout';
import SignInForm from '../signin-form/SignInForm';
import CreateAccountForm from '../create-account-form/CreateAccountForm';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@ui/button';
import MainNavigation from '../main-navigation/MainNavigation';

function AppRoutes() {
  const auth = useAuth();

  return (
    <Routes>
      <Route path="/" element={<MainNavigation />} />
      <Route element={<AuthorizedRoute />}>
        <Route
          path="/dashboard"
          element={
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Button onClick={auth?.signOut} variant="outline">
                Sign Out
              </Button>
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <div>
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
          }
        />
      </Route>

      <Route
        path="/signin"
        element={
          <AuthLayout>
            <SignInForm />
          </AuthLayout>
        }
      />
      <Route
        path="/create-account"
        element={
          <AuthLayout>
            <CreateAccountForm />
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
