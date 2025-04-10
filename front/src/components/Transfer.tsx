import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const transferSchema = z.object({
  address: z.string().min(42, 'La dirección debe tener 42 caracteres').max(42),
  amount: z.string().min(1, 'El monto es requerido'),
});

type TransferFormData = z.infer<typeof transferSchema>;

export default function Transfer() {
  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const onSubmit = async (data: TransferFormData) => {
    try {
      // TODO: Implementar la llamada al servidor
      console.log('Transfer form submitted:', data);
      toast.success('Transferencia enviada correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la transferencia');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Transferir ETH</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección ETH</FormLabel>
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
                    <Input placeholder="Introduce el monto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Transferir</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}