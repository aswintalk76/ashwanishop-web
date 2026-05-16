'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Reset link sent if email exists');
    } catch {
      toast.error('Failed to send reset link');
    }
  };

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Forgot Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <Button type="submit" className="w-full bg-orange-500">Send Reset Link</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
