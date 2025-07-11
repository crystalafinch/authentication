import { useContext, createContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnnouncer } from '../components/aria-announcer/AriaAnnouncer';

interface AuthContextType {
  token: string;
  user: any; // TODO: define type
  doLogin: (data: { email: string; password: string }) => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken') ?? '');
  const navigate = useNavigate();
  const announce = useAnnouncer();

  const doLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();

      if (!res.ok) {
        throw Error(res.error);
      }

      if (res.data) {
        setUser(res.data.user);
        setToken(res.token);
        localStorage.setItem('userToken', res.token);
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      console.error(err); // TODO: Sentry
      announce(`${err}`, 'assertive');
    }
  };

  const logOut = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <AuthContext value={{ token, user, doLogin, logOut }}>
      {children}
    </AuthContext>
  );
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
