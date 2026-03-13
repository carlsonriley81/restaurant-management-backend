'use client';

import React, { useEffect, useState } from 'react';
import { useMenuStore } from '@/stores/menuStore';
import { menuApi } from '@/services/menu.api';
import { formatMoney } from '@/utils/money';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MenuItem, CreateMenuItemPayload } from '@/types/menu';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MenuPage() {
  const { items, categories, fetchItems, fetchCategories, upsertItem, removeItem } = useMenuStore();
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchItems(), fetchCategories()]).finally(() => setIsLoading(false));
  }, [fetchItems, fetchCategories]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await menuApi.delete(id);
      removeItem(id);
    } catch {
      alert('Failed to delete item.');
    }
  };

  const handleToggleActive = async (item: MenuItem) => {
    try {
      const response = await menuApi.toggleActive(item.id, !item.active);
      upsertItem(response.data);
    } catch {
      // Optimistic update
      upsertItem({ ...item, active: !item.active });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading menu…</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Menu Manager</h1>
        <Button onClick={() => { setEditingItem(null); setIsFormOpen(true); }}>+ Add Item</Button>
      </div>

      {isFormOpen && (
        <MenuItemForm
          item={editingItem}
          categories={categories.map((c) => c.name)}
          onSave={(item) => { upsertItem(item); setIsFormOpen(false); }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-xl p-4 bg-card space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-base leading-tight">{item.name}</h3>
              <div className="flex gap-1 shrink-0">
                {item.limitedTime && <Badge variant="secondary">Limited</Badge>}
                <Badge variant={item.active ? 'default' : 'outline'}>{item.active ? 'Active' : 'Off'}</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary">{formatMoney(item.price)}</span>
              <span className="text-xs text-muted-foreground">{item.category}</span>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingItem(item); setIsFormOpen(true); }}>Edit</Button>
              <Button variant="outline" size="sm" onClick={() => handleToggleActive(item)}>
                {item.active ? 'Disable' : 'Enable'}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>✕</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuItemForm({
  item,
  categories,
  onSave,
  onCancel,
}: {
  item: MenuItem | null;
  categories: string[];
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateMenuItemPayload>({
    defaultValues: item ?? { active: true, limitedTime: false },
  });

  const onSubmit = async (values: CreateMenuItemPayload) => {
    try {
      if (item) {
        const response = await menuApi.update(item.id, values);
        onSave(response.data);
      } else {
        const response = await menuApi.create(values);
        onSave(response.data);
      }
    } catch {
      // For demo: save locally
      onSave({ id: `item-${Date.now()}`, ...values } as MenuItem);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl p-6 w-full max-w-lg m-4 space-y-4">
        <h2 className="text-xl font-bold">{item ? 'Edit' : 'Add'} Menu Item</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <Label>Name</Label>
              <Input {...register('name', { required: true })} placeholder="Dish name" />
              {errors.name && <p className="text-destructive text-xs">Required</p>}
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Description</Label>
              <Input {...register('description')} placeholder="Brief description" />
            </div>
            <div className="space-y-1">
              <Label>Price ($)</Label>
              <Input type="number" step="0.01" {...register('price', { required: true, valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Input {...register('category', { required: true })} list="categories" placeholder="Category" />
              <datalist id="categories">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" {...register('active')} className="w-4 h-4" />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="limitedTime" {...register('limitedTime')} className="w-4 h-4" />
              <Label htmlFor="limitedTime">Limited Time</Label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="flex-1">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
