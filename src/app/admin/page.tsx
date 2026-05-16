'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, ShoppingBag, Users, IndianRupee } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<{
    stats?: Record<string, number>;
    monthly_revenue?: { month: number; revenue: string }[];
    orders_by_status?: { status: string; count: number }[];
  }>({});

  useEffect(() => {
    api.get('/admin/analytics').then((res) => setData(res.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `₹${Number(data.stats?.total_revenue || 0).toLocaleString()}`, icon: IndianRupee },
    { label: 'Orders', value: data.stats?.total_orders || 0, icon: ShoppingBag },
    { label: 'Products', value: data.stats?.total_products || 0, icon: Package },
    { label: 'Users', value: data.stats?.total_users || 0, icon: Users },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-8">
        <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly_revenue || []}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
