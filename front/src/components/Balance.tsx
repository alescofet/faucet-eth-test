import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const balanceSchema = z.object({
  address: z.string().min(42, 'La dirección debe tener 42 caracteres').max(42),
});

type BalanceFormData = z.infer<typeof balanceSchema>;

export default function Balance() {
  const form = useForm<BalanceFormData>({
    resolver: zodResolver(balanceSchema),
  });

  const onSubmit = async (data: BalanceFormData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/balance/${data.address}`, {
        method: 'GET',})
        const responseData = await response.json();
        const {balance} = responseData;
      
        if (!response.ok) {
          throw new Error(responseData.error || 'Error en la solicitud');
        }
        console.log('Success', responseData);
        toast.success(`Balance actual: ${balance} ETH`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al consultar el balance');
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Consultar Balance</CardTitle>
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
            <Button type="submit" className="w-full">Consultar Balance</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}