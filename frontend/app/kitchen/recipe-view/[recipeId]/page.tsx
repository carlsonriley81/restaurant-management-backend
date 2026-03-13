'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { kitchenApi } from '@/services/kitchen.api';
import { RecipeViewer } from '@/components/kitchen/RecipeViewer';
import type { Recipe } from '@/types/kitchen';
import { sampleRecipes } from '@/utils/sampleData';

export default function RecipeViewPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    kitchenApi
      .getRecipe(recipeId)
      .then((res) => setRecipe(res.data))
      .catch(() => {
        // Fall back to sample data when API is unavailable
        const sample = sampleRecipes.find((r) => r.id === recipeId);
        if (sample) setRecipe(sample);
      })
      .finally(() => setLoading(false));
  }, [recipeId]);

  const handleClose = () => router.back();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl text-muted-foreground animate-pulse">Loading recipe…</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-2xl font-semibold text-muted-foreground">Recipe not found.</p>
        <button
          onClick={handleClose}
          className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-lg"
        >
          ← Back
        </button>
      </div>
    );
  }

  return <RecipeViewer recipe={recipe} onClose={handleClose} />;
}
