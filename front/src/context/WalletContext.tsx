import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
    interface Window {
      ethereum: MetaMaskInpageProvider;
    }
  }

interface WalletContextType {
  account: string;
  balance: string;
  setAccount: (account: string) => void;
  setBalance: (balance: string) => void;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Efecto para escuchar cambios de cuenta en MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        if (Array.isArray(accounts) && accounts.length > 0) {
          setAccount(accounts[0] as string);
          setIsConnected(true);
        } else {
          setAccount('');
          setBalance('');
          setIsConnected(false);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const connect = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request<string[]>({
          method: 'eth_requestAccounts'
        });
        if (accounts) {
          setAccount(accounts[0] as string);
          setIsConnected(true);
        }
      } else {
        console.error('No se encontró proveedor de Ethereum');
      }
    } catch (error) {
      console.error('Error al conectar wallet:', error);
    }
  };

  const disconnect = () => {
    setAccount('');
    setBalance('');
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        balance,
        setAccount,
        setBalance,
        isConnected,
        connect,
        disconnect
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet debe ser usado dentro de un WalletProvider');
  }
  return context;
}