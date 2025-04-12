import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Spinner } from './ui/spinner';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from '../context/WalletContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const balanceSchema = z.object({
  address: z.string().min(42, 'La dirección debe tener 42 caracteres').max(42),
});

type BalanceFormData = z.infer<typeof balanceSchema>;

export default function Balance() {
  const { account, isConnected, setBalance } = useWallet();
  const form = useForm<BalanceFormData>({
    resolver: zodResolver(balanceSchema),
    defaultValues: {
      address: account
    }
  });

  useEffect(() => {
    form.setValue('address', account);
  }, [account, form]);

  const onSubmit = async (data: BalanceFormData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/balance/${data.address}`, {
        method: 'GET',
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Error en la solicitud');
      }

      const { balance } = responseData;
      if (data.address === account) {
        setBalance(balance);
      }

      toast.success(`Balance: ${balance} ETH`);
      form.reset({ ...form.getValues() }, { keepIsSubmitted: false });
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al consultar el balance');
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Consultar Balance</CardTitle>
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
                    <FormLabel>Dirección ETH</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduce la dirección ETH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner className="mr-2 w-4 h-4" />
                    Consultando...
                  </>
                ) : (
                  'Consultar Balance'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}