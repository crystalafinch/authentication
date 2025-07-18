import { Routes, Route } from 'react-router-dom';
import AuthorizedRoute from '../authorized-route/AuthorizedRoute';
import AuthLayout from '../auth-layout/AuthLayout';
import SignInForm from '../signin-form/SignInForm';
import SignUpForm from '../signup-form/SignUpForm';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthorizedRoute />}>
        <Route
          path="/dashboard"
          element={
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
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
        path="/signup"
        element={
          <AuthLayout>
            <SignUpForm />
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
