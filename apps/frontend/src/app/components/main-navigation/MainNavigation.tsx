import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // TODO: tsconfig path

const MainNavigation = () => {
  const auth = useAuth();

  return (
    <div role="navigation">
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        {auth?.token ? (
          <li>
            <Link to="/login">Logout</Link>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default MainNavigation;
