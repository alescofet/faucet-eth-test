import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { Button } from './ui/button';
import { useWallet } from '../context/WalletContext';

export default function Home() {
  const { account, isConnected, connect, disconnect } = useWallet();

  return (
    <Card className="mx-auto w-full max-w-2xl text-center">
      <CardHeader>
        <CardTitle className="text-3xl">Bienvenido a ETH Faucet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {!isConnected ? (
            <Button onClick={connect} className="bg-primary hover:bg-primary/90">
              Conectar Wallet
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Wallet conectada:</p>
              <p className="font-mono text-sm">{account}</p>
              <Button onClick={disconnect} variant="outline">
                Desconectar
              </Button>
            </div>
          )}
        </div>
        <p className="text-lg text-muted-foreground">
          Esta aplicación te permite interactuar con la red de prueba de Ethereum de manera sencilla.
        </p>
        <div className="grid gap-4 text-left">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Características principales:</h3>
            <ul className="space-y-1 list-disc list-inside text-muted-foreground">
              <li>Obtén ETH de prueba gratis a través del Faucet</li>
              <li>Realiza transferencias entre direcciones</li>
              <li>Consulta el balance de cualquier dirección</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">¿Cómo empezar?</h3>
            <p className="text-muted-foreground">
              {!isConnected 
                ? "Conecta tu wallet para comenzar a utilizar la aplicación."
                : "Selecciona una de las opciones en la barra de navegación superior para comenzar a utilizar la aplicación."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}