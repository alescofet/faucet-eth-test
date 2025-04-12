import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function Home() {
  return (
    <Card className="mx-auto w-full max-w-2xl text-center">
      <CardHeader>
        <CardTitle className="text-3xl">Bienvenido a ETH Faucet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
              Selecciona una de las opciones en la barra de navegación superior para comenzar a utilizar la aplicación.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}