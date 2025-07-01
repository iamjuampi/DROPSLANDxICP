import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export type WalletType = 'ii' | 'plug' | null;

interface UseICPAuthReturn {
  isAuthenticated: boolean;
  identity: any | null;
  principal: Principal | null;
  login: (walletType: WalletType) => Promise<void>;
  logout: () => Promise<void>;
  walletType: WalletType;
}

export function useICPAuth(): UseICPAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<any>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authClient = await AuthClient.create();
      const isLoggedIn = await authClient.isAuthenticated();
      
      if (isLoggedIn) {
        const identity = authClient.getIdentity();
        setIdentity(identity);
        setPrincipal(identity.getPrincipal());
        setIsAuthenticated(true);
        setWalletType('ii');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const login = async (walletType: WalletType) => {
    try {
      if (walletType === 'ii') {
        const authClient = await AuthClient.create();
        await authClient.login({
          identityProvider: process.env.NEXT_PUBLIC_II_URL || 'https://identity.ic0.app',
          onSuccess: async () => {
            const identity = authClient.getIdentity();
            setIdentity(identity);
            setPrincipal(identity.getPrincipal());
            setIsAuthenticated(true);
            setWalletType('ii');
          },
        });
      } else if (walletType === 'plug') {
        // Implementar lógica de Plug aquí
        console.log('Plug wallet login not implemented yet');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      if (walletType === 'ii') {
        const authClient = await AuthClient.create();
        await authClient.logout();
      }
      setIdentity(null);
      setPrincipal(null);
      setIsAuthenticated(false);
      setWalletType(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    isAuthenticated,
    identity,
    principal,
    login,
    logout,
    walletType,
  };
} 