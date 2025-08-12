import AppRoutes from './components/app-routes/AppRoutes';
import AppProviders from './components/app-providers/AppProviders';

export function App() {
  return (
    <div>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </div>
  );
}

export default App;
