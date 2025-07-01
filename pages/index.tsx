import MainApp from "@/components/main-app";
import LoginScreen from "@/components/login-screen";
import { useAuth as useLocalAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export default function BeansApp() {
  const { login, loginWithII, isAuthenticated, userData, isIIUser } = useLocalAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-4">
        <div className="w-full max-w-md">
          <div className="animate-pulse">
            <div className="h-11 bg-gray-800 rounded mb-4"></div>
            <div className="h-11 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-4">
        <LoginScreen onLogin={login} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-950 overflow-hidden">
      <MainApp />
    </div>
  );
} 