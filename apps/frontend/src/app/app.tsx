// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import MainNavigation from './components/main-navigation/MainNavigation';
import AppRoutes from './components/app-routes/AppRoutes';
import AppProviders from './components/app-providers/AppProviders';

export function App() {
  return (
    <div>
      <AppProviders>
        <MainNavigation />
        <AppRoutes />
      </AppProviders>
    </div>
  );
}

export default App;
