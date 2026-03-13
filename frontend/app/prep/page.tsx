'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/dates';
import api from '@/services/api';

interface PrepRecord {
  id: string;
  itemPrepped: string;
  servingsCreated: number;
  servingsUsed: number;
  datePrepped: string;
  usedFor: string;
  requiredServings: number;
}

interface PrepFormValues {
  itemPrepped: string;
  servingsCreated: number;
  servingsUsed: number;
  usedFor: string;
  requiredServings: number;
}

export default function PrepPage() {
  const [records, setRecords] = useState<PrepRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PrepFormValues>();

  const onSubmit = async (values: PrepFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post<PrepRecord>('/prep', values);
      setRecords((prev) => [response.data, ...prev]);
    } catch {
      // Dev fallback: add locally
      const record: PrepRecord = {
        id: `prep-${Date.now()}`,
        ...values,
        datePrepped: new Date().toISOString(),
      };
      setRecords((prev) => [record, ...prev]);
    } finally {
      setIsLoading(false);
      setIsFormOpen(false);
      reset();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Prep Manager</h1>
        <Button onClick={() => setIsFormOpen(true)}>+ Add Prep Record</Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl p-6 w-full max-w-lg m-4">
            <h2 className="text-xl font-bold mb-4">Log Prep</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <Label>Item Prepped</Label>
                  <Input {...register('itemPrepped', { required: true })} placeholder="e.g. Caesar Dressing" />
                  {errors.itemPrepped && <p className="text-destructive text-xs">Required</p>}
                </div>
                <div className="space-y-1">
                  <Label>Servings Created</Label>
                  <Input type="number" {...register('servingsCreated', { required: true, valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <Label>Servings Used</Label>
                  <Input type="number" {...register('servingsUsed', { required: true, valueAsNumber: true })} />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Used For</Label>
                  <Input {...register('usedFor')} placeholder="e.g. Dinner service" />
                </div>
                <div className="space-y-1">
                  <Label>Required Servings</Label>
                  <Input type="number" {...register('requiredServings', { required: true, valueAsNumber: true })} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No prep records yet. Add one to get started.</div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <Card key={record.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{record.itemPrepped}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Servings Created</p>
                    <p className="font-semibold">{record.servingsCreated}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Servings Used</p>
                    <p className="font-semibold">{record.servingsUsed}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Required</p>
                    <p className="font-semibold">{record.requiredServings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Date</p>
                    <p className="font-semibold">{formatDate(record.datePrepped)}</p>
                  </div>
                </div>
                {record.usedFor && (
                  <p className="mt-2 text-xs text-muted-foreground">Used for: {record.usedFor}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
