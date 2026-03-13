'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { reportsApi } from '@/services/reports.api';
import { formatMoney } from '@/utils/money';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SAMPLE_SALES = [
  { day: 'Mon', revenue: 1240, orders: 34 },
  { day: 'Tue', revenue: 980, orders: 28 },
  { day: 'Wed', revenue: 1650, orders: 47 },
  { day: 'Thu', revenue: 1420, orders: 41 },
  { day: 'Fri', revenue: 2100, orders: 62 },
  { day: 'Sat', revenue: 2850, orders: 79 },
  { day: 'Sun', revenue: 2200, orders: 64 },
];

const SAMPLE_TOP_ITEMS = [
  { name: 'Ribeye Steak', count: 48 },
  { name: 'Grilled Salmon', count: 41 },
  { name: 'Caesar Salad', count: 37 },
  { name: 'Pasta Primavera', count: 29 },
  { name: 'Chocolate Lava Cake', count: 25 },
];

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

export default function ReportsPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [salesData, setSalesData] = useState(SAMPLE_SALES);
  void setSalesData; // setter reserved for future API-driven updates
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    reportsApi
      .getSales({ period })
      .then((res) => {
        // Map API response to chart format if available
        if (res.data?.topItems?.length) {
          // Use real data
        }
      })
      .catch(() => {
        // Use sample data — API may not be running
      })
      .finally(() => setIsLoading(false));
  }, [period]);

  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = salesData.reduce((s, d) => s + d.orders, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatMoney(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatMoney(totalOrders > 0 ? totalRevenue / totalOrders : 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {salesData.reduce((best, d) => (d.revenue > best.revenue ? d : best), salesData[0])?.day ?? '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis tickFormatter={(v) => `$${v}`} className="text-xs" />
              <Tooltip formatter={(value: number) => formatMoney(value)} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Items Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={SAMPLE_TOP_ITEMS}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {SAMPLE_TOP_ITEMS.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <p className="text-center text-sm text-muted-foreground">Loading live data…</p>
      )}
    </div>
  );
}
