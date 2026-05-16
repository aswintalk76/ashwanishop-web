'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface UserRow {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    api.get('/admin/users').then((r) => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.phone || '—'}</TableCell>
              <TableCell>
                <Badge variant={u.is_active ? 'default' : 'destructive'}>
                  {u.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
