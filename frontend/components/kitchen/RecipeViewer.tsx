'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import type { Recipe } from '@/types/kitchen';

interface RecipeViewerProps {
  recipe: Recipe;
  onClose: () => void;
  className?: string;
}

export const RecipeViewer = memo(function RecipeViewer({
  recipe,
  onClose,
  className,
}: RecipeViewerProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col overflow-y-auto',
        className,
      )}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background border-b border-border">
        <h1 className="text-3xl font-black">{recipe.dishName}</h1>
        <button
          onClick={onClose}
          className="ml-4 px-5 py-3 rounded-xl bg-destructive text-destructive-foreground font-bold text-xl transition-colors hover:bg-destructive/80 active:scale-95"
        >
          ✕ Close
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-6xl mx-auto w-full">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Dish image */}
          {recipe.dishImage && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted">
              <Image
                src={recipe.dishImage}
                alt={recipe.dishName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}

          {/* Serving size */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
            <span className="text-4xl">🍽</span>
            <div>
              <p className="text-sm text-muted-foreground uppercase font-semibold tracking-wide">
                Serving Size
              </p>
              <p className="text-2xl font-bold">{recipe.servingSize}</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Ingredients */}
          <section>
            <h2 className="text-2xl font-bold mb-3">Ingredients</h2>
            <ul className="divide-y divide-border rounded-xl border overflow-hidden">
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.id}
                  className="flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-lg">{ing.name}</span>
                  <span className="font-mono font-bold text-xl">
                    {ing.amount} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Prep instructions */}
          {recipe.prepInstructions && (
            <section>
              <h2 className="text-2xl font-bold mb-3">Prep Instructions</h2>
              <div className="p-4 rounded-xl bg-muted text-lg leading-relaxed whitespace-pre-wrap">
                {recipe.prepInstructions}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});
