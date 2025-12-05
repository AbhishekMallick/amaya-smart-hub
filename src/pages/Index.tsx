import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { TuyaProvider } from '@/contexts/TuyaContext';
import { DeviceProvider } from '@/contexts/DeviceContext';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <TuyaProvider>
      <DeviceProvider>
        <Dashboard />
      </DeviceProvider>
    </TuyaProvider>
  );
}

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
