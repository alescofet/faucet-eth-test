import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useWallet } from '../context/WalletContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const transferSchema = z.object({
  address: z.string().min(42, 'La dirección debe tener 42 caracteres').max(42),
  amount: z.string().min(1, 'El monto es requerido'),
});

type TransferFormData = z.infer<typeof transferSchema>;

export default function Transfer() {
  const { account, isConnected, setBalance } = useWallet();
  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const onSubmit = async (data: TransferFormData) => {
    if (!isConnected) {
      toast.error('Por favor, conecta tu wallet primero');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: account,
          to: data.address,
          amount: data.amount
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Error en la solicitud');
      }

      // Actualizar el balance después de la transferencia
      const balanceResponse = await fetch(`http://localhost:3000/api/balance/${account}`);
      const balanceData = await balanceResponse.json();
      if (balanceResponse.ok) {
        setBalance(balanceData.balance);
      }

      toast.success('Transferencia realizada correctamente');
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar la transferencia');
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Transferir ETH</CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="text-center text-muted-foreground">
            Por favor, conecta tu wallet en la página principal para continuar.
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección ETH de destino</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduce la dirección ETH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.000000000000000001" placeholder="Introduce el monto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Transferir</Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}