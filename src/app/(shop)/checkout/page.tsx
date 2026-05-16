'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api';
import { StorageImage } from '@/components/storage-image';
import {
  ShippingAddressSection,
  buildShippingPayload,
  type AddressView,
  type ShippingFormData,
} from '@/components/checkout/shipping-address-section';
import { createOrder } from '@/services/orders';
import { toast } from 'sonner';

const schema = z.object({
  shipping_address: z.string().min(5),
  shipping_city: z.string().min(2),
  shipping_state: z.string().min(2),
  shipping_pincode: z.string().min(6),
  shipping_phone: z.string().min(10),
  notes: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const { items, subtotal, fetchCart } = useCartStore();
  const [paymentQr, setPaymentQr] = useState<string | null>(null);
  const [upiId, setUpiId] = useState('');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [addressView, setAddressView] = useState<AddressView>('form');
  const [saveToProfile, setSaveToProfile] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(schema),
    shouldUnregister: false,
    defaultValues: {
      shipping_address: '',
      shipping_city: '',
      shipping_state: '',
      shipping_pincode: '',
      shipping_phone: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }
    fetchCart();
    api.get('/settings/public').then((res) => {
      setPaymentQr(res.data.settings?.payment_qr_image);
      setUpiId(res.data.settings?.upi_id || '');
    });
  }, [user, fetchCart, router]);

  const placeOrder = async (formData: ShippingFormData) => {
    if (!user) return;
    const payload = buildShippingPayload(user, formData, addressView);
    try {
      if (addressView === 'form' && saveToProfile) {
        await api.put('/auth/profile', {
          address: payload.shipping_address,
          city: payload.shipping_city,
          state: payload.shipping_state,
          pincode: payload.shipping_pincode,
          phone: payload.shipping_phone,
        });
        await fetchMe();
      }
      const order = await createOrder(payload);
      setOrderNumber(order.order_number);
      toast.success('Order placed! Complete UPI payment below.');
    } catch {
      toast.error('Failed to place order');
    }
  };

  const submitPayment = async () => {
    if (!orderNumber || !txnId) {
      toast.error('Enter transaction ID');
      return;
    }
    const formData = new FormData();
    formData.append('transaction_id', txnId);
    if (screenshot) formData.append('screenshot', screenshot);
    try {
      await api.post(`/orders/${orderNumber}/payment-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Payment proof submitted!');
      router.push(`/orders/${orderNumber}`);
    } catch {
      toast.error('Failed to submit payment proof');
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        {!orderNumber ? (
          <form onSubmit={handleSubmit(placeOrder)} className="space-y-4">
            <ShippingAddressSection
              user={user}
              register={register}
              reset={reset}
              errors={errors}
              onViewChange={setAddressView}
            />
            {addressView === 'form' && (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={saveToProfile} onCheckedChange={(v) => setSaveToProfile(v === true)} />
                Save this address to my profile for next orders
              </label>
            )}
            <Button type="submit" disabled={isSubmitting} className="bg-orange-500">
              Place Order — ₹{subtotal.toLocaleString()}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border bg-green-50 p-4 dark:bg-green-950">
              <p className="font-medium">Order #{orderNumber} created</p>
              <p className="text-sm text-muted-foreground">Scan QR and pay via UPI, then submit proof below</p>
            </div>
            {paymentQr && (
              <div className="rounded-xl border p-6 text-center">
                <p className="mb-4 font-medium">Scan to Pay {upiId && `(${upiId})`}</p>
                <StorageImage path={paymentQr} alt="Payment QR" width={250} height={250} className="mx-auto" />
                <p className="mt-4 text-2xl font-bold">₹{subtotal.toLocaleString()}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Label>Transaction ID / UTR</Label>
                <Input value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="Enter UPI transaction ID" />
              </div>
              <div>
                <Label>Payment Screenshot (optional)</Label>
                <Input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={submitPayment} className="w-full bg-orange-500">Submit Payment Proof</Button>
            </div>
          </div>
        )}
        <div className="rounded-xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Order Items ({items.length})</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4 font-bold">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
