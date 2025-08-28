import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const MainNavigation = () => {
  const auth = useAuth();

  return (
    <nav className="flex gap-4 items-center p-4">
      <Link to="/">Home</Link>
      <ul className="flex gap-4 items-center">
        {auth?.state.user ? (
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
    </nav>
  );
};

export default MainNavigation;
