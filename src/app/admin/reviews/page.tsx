'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Review {
  id: number;
  rating: number;
  comment?: string;
  status: string;
  user?: { name: string };
  product?: { name: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const load = () => api.get('/admin/reviews').then((r) => setReviews(r.data.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/admin/reviews/${id}`, { status });
      toast.success(`Review ${status}`);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Reviews</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.product?.name || '—'}</TableCell>
              <TableCell>{r.user?.name || '—'}</TableCell>
              <TableCell>{r.rating} ★</TableCell>
              <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
              <TableCell className="space-x-2">
                {r.status === 'pending' && (
                  <>
                    <Button size="sm" className="bg-green-600" onClick={() => updateStatus(r.id, 'approved')}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, 'rejected')}>Reject</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
