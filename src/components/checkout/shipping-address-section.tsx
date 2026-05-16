'use client';

import { useEffect, useState } from 'react';
import { UseFormRegister, UseFormReset, FieldErrors } from 'react-hook-form';
import { MapPin, Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

export type ShippingFormData = {
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_phone: string;
  notes?: string;
};

export type AddressView = 'saved' | 'form';

function userHasSavedAddress(user: User): boolean {
  return Boolean(
    user.address?.trim() &&
    user.city?.trim() &&
    user.state?.trim() &&
    user.pincode?.trim() &&
    user.phone?.trim()
  );
}

function userToShipping(user: User): ShippingFormData {
  return {
    shipping_address: user.address || '',
    shipping_city: user.city || '',
    shipping_state: user.state || '',
    shipping_pincode: user.pincode || '',
    shipping_phone: user.phone || '',
    notes: '',
  };
}

type Props = {
  user: User;
  register: UseFormRegister<ShippingFormData>;
  reset: UseFormReset<ShippingFormData>;
  errors: FieldErrors<ShippingFormData>;
  onViewChange?: (view: AddressView) => void;
};

export function ShippingAddressSection({
  user,
  register,
  reset,
  errors,
  onViewChange,
}: Props) {
  const hasSaved = userHasSavedAddress(user);
  const [view, setView] = useState<AddressView>(hasSaved ? 'saved' : 'form');
  const [formMode, setFormMode] = useState<'new' | 'edit'>('new');

  useEffect(() => {
    const initial = hasSaved ? 'saved' : 'form';
    setView(initial);
    onViewChange?.(initial);
    reset(userToShipping(user));
  }, [user, hasSaved, reset, onViewChange]);

  const switchView = (next: AddressView, mode: 'new' | 'edit' = 'new') => {
    setView(next);
    setFormMode(mode);
    onViewChange?.(next);
    if (next === 'form') {
      reset(
        mode === 'edit'
          ? userToShipping(user)
          : {
              shipping_address: '',
              shipping_city: '',
              shipping_state: '',
              shipping_pincode: '',
              shipping_phone: user.phone || '',
              notes: '',
            }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shipping Details</h2>
        {hasSaved && view === 'saved' && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => switchView('form', 'new')}
          >
            <Plus className="mr-1 h-4 w-4" /> New address
          </Button>
        )}
      </div>

      {view === 'saved' && hasSaved && (
        <div className="space-y-3">
          <div
            className={cn(
              'rounded-xl border-2 border-orange-500 bg-orange-500/5 p-4',
              'ring-2 ring-orange-500/20'
            )}
          >
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
              <div>
                <p className="font-medium text-orange-600 dark:text-orange-400">Saved address</p>
                <p className="mt-2 text-sm whitespace-pre-line">
                  {user.address}
                  {'\n'}
                  {user.city}, {user.state} — {user.pincode}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Phone: {user.phone}</p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-orange-500"
            onClick={() => switchView('form', 'edit')}
          >
            <Pencil className="mr-1 h-4 w-4" /> Edit this address
          </Button>
        </div>
      )}

      {view === 'form' && (
        <div className="space-y-4 rounded-xl border p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">
              {formMode === 'edit' ? 'Edit address' : 'New delivery address'}
            </p>
            {hasSaved && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="shrink-0 text-orange-500"
                onClick={() => switchView('saved')}
              >
                ← Use saved address
              </Button>
            )}
          </div>

          <div>
            <Label>Address</Label>
            <Textarea {...register('shipping_address')} rows={3} />
            {errors.shipping_address && (
              <p className="text-sm text-destructive">{errors.shipping_address.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>City</Label>
              <Input {...register('shipping_city')} />
              {errors.shipping_city && (
                <p className="text-sm text-destructive">{errors.shipping_city.message}</p>
              )}
            </div>
            <div>
              <Label>State</Label>
              <Input {...register('shipping_state')} />
              {errors.shipping_state && (
                <p className="text-sm text-destructive">{errors.shipping_state.message}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Pincode</Label>
              <Input {...register('shipping_pincode')} />
              {errors.shipping_pincode && (
                <p className="text-sm text-destructive">{errors.shipping_pincode.message}</p>
              )}
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register('shipping_phone')} />
              {errors.shipping_phone && (
                <p className="text-sm text-destructive">{errors.shipping_phone.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <Label>Order notes (optional)</Label>
        <Textarea {...register('notes')} rows={2} placeholder="Delivery instructions..." />
      </div>
    </div>
  );
}

export function buildShippingPayload(
  user: User,
  formData: ShippingFormData,
  view: AddressView
): ShippingFormData {
  if (view === 'saved' && userHasSavedAddress(user)) {
    return {
      ...userToShipping(user),
      notes: formData.notes,
    };
  }
  return formData;
}

export { userHasSavedAddress };
