import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const faucetSchema = z.object({
  address: z.string().min(42, 'La dirección debe tener 42 caracteres').max(42),
});

type FaucetFormData = z.infer<typeof faucetSchema>;

export default function Faucet() {
  const form = useForm<FaucetFormData>({
    resolver: zodResolver(faucetSchema),
  });

  const onSubmit = async (data: FaucetFormData) => {
    try {
      const response = await fetch("http://localhost:3000/faucet", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: data.address })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Error en la solicitud');
      }
      console.log('Respuesta del servidor:', responseData);
      toast.success('Solicitud enviada correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar la solicitud');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Faucet</CardTitle>
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
            <Button type="submit" className="w-full cursor-pointer">Solicitar ETH</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}