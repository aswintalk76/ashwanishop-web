'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function QrScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const processingRef = useRef(false);

  const safeStop = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner || !isRunningRef.current) {
      setScanning(false);
      return;
    }

    try {
      await scanner.stop();
    } catch {
      // Scanner already stopped or never fully started
    }

    try {
      scanner.clear();
    } catch {
      // ignore
    }

    isRunningRef.current = false;
    scannerRef.current = null;
    setScanning(false);
  }, []);

  const startScanner = async () => {
    try {
      await safeStop();

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        async (decoded) => {
          if (processingRef.current) return;
          processingRef.current = true;

          try {
            const payload = JSON.parse(decoded);
            await safeStop();

            const res = await api.post('/admin/qr/scan', {
              token: payload.token,
              order_number: payload.order_number,
            });
            setResult(res.data);
            toast.success(res.data.message || 'Delivery verified!');
          } catch (err: unknown) {
            const msg =
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Invalid QR or verification failed';
            toast.error(msg);
            processingRef.current = false;
          }
        },
        () => {}
      );

      isRunningRef.current = true;
      setScanning(true);
    } catch {
      await safeStop();
      toast.error('Could not start camera. Allow permission or use HTTPS/localhost.');
    }
  };

  useEffect(() => {
    return () => {
      void safeStop();
    };
  }, [safeStop]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Delivery QR Scanner</h1>
      <Card>
        <CardHeader><CardTitle>Scan customer delivery QR (order must be Shipped)</CardTitle></CardHeader>
        <CardContent>
          <div id="qr-reader" className="mx-auto max-w-md overflow-hidden rounded-lg" />
          <div className="mt-4 flex gap-4">
            {!scanning ? (
              <Button onClick={startScanner} className="bg-orange-500">
                Start Scanner
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => void safeStop()}>
                Stop Scanner
              </Button>
            )}
          </div>
          {result && (
            <pre className="mt-6 overflow-auto rounded-lg bg-muted p-4 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
