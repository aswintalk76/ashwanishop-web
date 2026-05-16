'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const load = () => api.get('/admin/categories').then((r) => setCategories(r.data.categories || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/categories', { name, description, is_active: true });
      toast.success('Category created');
      setName('');
      setDescription('');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Cannot delete — products may exist');
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Categories</h1>
      <Card className="mb-8">
        <CardHeader><CardTitle>Add Category</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-4">
            <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="flex items-end"><Button type="submit" className="bg-orange-500">Add</Button></div>
          </form>
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Active</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.slug}</TableCell>
              <TableCell>{c.is_active ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
