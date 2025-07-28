import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // TODO: tsconfig path

const MainNavigation = () => {
  const auth = useAuth();

  return (
    <div role="navigation">
      <ul>
        {auth?.token ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={auth?.signOut}>Sign Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signin">Sign in</Link>
            </li>
            <li>
              <Link to="/create-account">Create account</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default MainNavigation;
