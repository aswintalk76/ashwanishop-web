'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    discount: '0',
    sku: '',
    stock: '',
    status: 'active',
  });

  const load = () => {
    api.get('/admin/products').then((r) => setProducts(r.data.data || [])).catch(() => {});
    api.get('/admin/categories').then((r) => setCategories(r.data.categories || [])).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/products', form);
      toast.success('Product created');
      setForm({ category_id: '', name: '', description: '', price: '', discount: '0', sku: '', stock: '', status: 'active' });
      load();
    } catch {
      toast.error('Failed to create product');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Products</h1>

      <Card className="mb-8">
        <CardHeader><CardTitle>Add Product</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Category</Label>
              <select
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="md:col-span-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
            <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
            <div><Label>Discount %</Label><Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></div>
            <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></div>
            <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></div>
            <div><Button type="submit" className="bg-orange-500">Add Product</Button></div>
          </form>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.sku}</TableCell>
              <TableCell>₹{p.price}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
