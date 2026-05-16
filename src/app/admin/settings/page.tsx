'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { StorageImage } from '@/components/storage-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [upiId, setUpiId] = useState('');
  const [paymentQr, setPaymentQr] = useState<string | null>(null);
  const [qrFile, setQrFile] = useState<File | null>(null);

  const load = () => {
    api.get('/admin/payment-qr').then((res) => {
      setUpiId(res.data.upi_id || '');
      setPaymentQr(res.data.payment_qr_image || null);
    }).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const savePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    if (upiId) data.append('upi_id', upiId);
    if (qrFile) data.append('payment_qr', qrFile);
    try {
      await api.post('/admin/payment-qr', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Payment settings saved');
      load();
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>UPI Payment QR (Checkout page)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={savePayment} className="max-w-md space-y-4">
            <div>
              <Label>UPI ID</Label>
              <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" />
            </div>
            <div>
              <Label>Payment QR image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files?.[0] || null)} />
            </div>
            {paymentQr && (
              <StorageImage path={paymentQr} alt="Current QR" width={200} height={200} className="rounded-lg border" />
            )}
            <Button type="submit" className="bg-orange-500">Save</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Admin login URL</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>Login:</strong> <a href="/admin/login" className="text-orange-500">http://localhost:3000/admin/login</a></p>
          <p><strong>Email:</strong> admin@ashwanishop.com</p>
          <p><strong>Password:</strong> Admin@12345 (change after first login in production)</p>
        </CardContent>
      </Card>
    </div>
  );
}
