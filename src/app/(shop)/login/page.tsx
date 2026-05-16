'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.token);
      toast.success('Welcome back!');
      router.push('/account');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Access your account and orders</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/forgot-password" className="text-orange-500 hover:underline">Forgot password?</Link>
          </p>
          <p className="mt-2 text-center text-sm">
            No account? <Link href="/register" className="text-orange-500 hover:underline">Register</Link>
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Store manager?{' '}
            <Link href="/admin/login" className="font-medium text-orange-500 hover:underline">
              Admin panel login →
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
