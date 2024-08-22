export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  categoryId: string;
  locationId: string;
  name: string;
  description: string;
  image: string | null;
  createdAt: string;
}