export interface Category {
  name: string;
  description: string;
}

export interface Location {
  name: string;
  description: string;
}

export interface InventoryItem {
  categoryId: string;
  locationId: string;
  name: string;
  description: string;
  image: string | null;
  createdAt: string;
}
