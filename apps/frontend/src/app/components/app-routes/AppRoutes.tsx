import { Routes, Route } from 'react-router-dom';
import AuthForm from '../auth-form/AuthForm';
import AuthorizedRoute from '../authorized-route/AuthorizedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthorizedRoute />}>
        <Route
          path="/"
          element={
            <div>
              <h1>Dashboard</h1>
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <div>
              <h1>Profile</h1>
            </div>
          }
        />
      </Route>

      <Route
        path="/login"
        element={
          <div>
            <h1>Login</h1>
            <AuthForm endpoint="login" />
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div>
            <h1>Signup</h1>
            <AuthForm endpoint="signup" />
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
