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
            <button onClick={auth?.signOut}>Sign Out</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default MainNavigation;
