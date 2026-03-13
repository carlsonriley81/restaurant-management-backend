export interface MenuCategory {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId?: string;
  recipeId?: string;
  image?: string;
  active: boolean;
  limitedTime: boolean;
}

export interface CreateMenuItemPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  recipeId?: string;
  image?: string;
  active: boolean;
  limitedTime: boolean;
}
