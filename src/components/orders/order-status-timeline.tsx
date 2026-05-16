import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const steps: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'payment_verified', label: 'Payment Verified' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'completed', label: 'Completed' },
];

const statusOrder: OrderStatus[] = steps.map((s) => s.key);

function stepIndex(status: OrderStatus): number {
  if (status === 'cancelled') return -1;
  const idx = statusOrder.indexOf(status);
  return idx >= 0 ? idx : 0;
}

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const current = stepIndex(status);

  if (status === 'cancelled') {
    return <p className="text-sm font-medium text-destructive">Order cancelled</p>;
  }

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2',
                  done
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'min-h-8 w-0.5 flex-1',
                    done && i < current ? 'bg-orange-500' : 'bg-border'
                  )}
                />
              )}
            </div>
            <div className={cn('pb-8', i === steps.length - 1 && 'pb-0')}>
              <p className={cn('font-medium', active && 'text-orange-500')}>{step.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
