import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const transferSchema = z.object({
  address: z.string().min(42, 'La dirección debe tener 42 caracteres').max(42),
  amount: z.string()
    .min(1, 'El monto es requerido')
    .regex(/^\d+(\.\d+)?$/, 'El monto debe ser un número válido')
    .transform((val) => val.replace(/^0+(?=\d)/, ''))
});

type TransferFormData = z.infer<typeof transferSchema>;

export default function Transfer() {
  const { account, isConnected, setBalance } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const onSubmit = async (data: TransferFormData) => {
    try {
    setIsLoading(true);
    if (!isConnected) {
      toast.error('Por favor, conecta tu wallet primero');
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    if (!provider) {
      throw new Error('MetaMask no está instalado');
    }
    const signer = await provider.getSigner(account);
    const transaction = await signer.sendTransaction({
      to: data.address,
      value: ethers.parseEther(data.amount),
    });
    const tx = await transaction.wait();
      // Esperar a que la transacción sea minada


      // Actualizar el balance después de la transferencia
      const balanceResponse = await fetch(`http://localhost:3000/api/balance/${account}`);
      const balanceData = await balanceResponse.json();
      if (balanceResponse.ok) {
        setBalance(balanceData.balance);
      }

      toast.success('Transacción enviada. Hash: ' + tx?.hash);
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar la transferencia');
    } finally {
      setIsLoading(false);
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
                      <Input 
                        type="text" 
                        pattern="^\d*\.?\d*$"
                        placeholder="Introduce el monto" 
                        {...field} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Transferir'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}