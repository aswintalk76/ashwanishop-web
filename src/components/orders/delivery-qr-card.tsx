'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Copy, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { DeliveryQr } from '@/types';
import { toast } from 'sonner';

type Props = {
  deliveryQr: DeliveryQr;
};

export function DeliveryQrCard({ deliveryQr }: Props) {
  const qrValue =
    deliveryQr.qr_payload ||
    JSON.stringify({
      type: 'delivery',
      order_number: deliveryQr.order_number,
      token: deliveryQr.token,
    });

  const copyToken = () => {
    void navigator.clipboard.writeText(deliveryQr.token);
    toast.success('Delivery token copied');
  };

  return (
    <Card className="border-orange-500/40 bg-orange-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <QrCode className="h-5 w-5" /> Delivery QR & Token
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Payment verified. Show this QR to the delivery person when your order arrives.
          Admin will scan it after shipping to confirm delivery.
        </p>
        <div className="flex justify-center rounded-xl border bg-white p-4 dark:bg-zinc-900">
          <QRCodeSVG value={qrValue} size={220} level="M" includeMargin />
        </div>
        <div className="rounded-lg border bg-background p-3">
          <p className="text-xs font-medium text-muted-foreground">Unique delivery token</p>
          <p className="mt-1 break-all font-mono text-xs">{deliveryQr.token}</p>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={copyToken}>
            <Copy className="mr-1 h-3 w-3" /> Copy token
          </Button>
        </div>
        {deliveryQr.expires_at && (
          <p className="text-xs text-muted-foreground">
            Valid until {new Date(deliveryQr.expires_at).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
