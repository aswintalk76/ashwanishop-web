'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-errors';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@ashwanishop.com', password: '' },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const res = await api.post('/admin/auth/login', data);
      Cookies.set('auth_token', res.data.token, { expires: 1 });
      setAuth(res.data.user, res.data.token);
      toast.success('Admin login successful');
      router.push('/admin');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Invalid admin credentials'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage products, orders, payments &amp; delivery QR
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Label>Email</Label><Input type="email" {...register('email')} /></div>
            <div><Label>Password</Label><Input type="password" {...register('password')} /></div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>Sign In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
