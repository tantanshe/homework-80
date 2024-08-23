import {promises as fs} from 'fs';
import path from 'path';
import {Category, Location, InventoryItem} from './types';

const categoriesFileName = path.join('./db', 'categories.json');
const locationsFileName = path.join('./db', 'locations.json');
const itemsFileName = path.join('./db', 'items.json');

let categories: Category[] = [];
let locations: Location[] = [];
let items: InventoryItem[] = [];

const fileDb = {
  async init() {
    try {
      const categoriesContents = await fs.readFile(categoriesFileName);
      categories = JSON.parse(categoriesContents.toString());
    } catch (e) {
      categories = [];
    }

    try {
      const locationsContents = await fs.readFile(locationsFileName);
      locations = JSON.parse(locationsContents.toString());
    } catch (e) {
      locations = [];
    }

    try {
      const itemsContents = await fs.readFile(itemsFileName);
      items = JSON.parse(itemsContents.toString());
    } catch (e) {
      items = [];
    }
  },

  async getCategories() {
    return categories;
  },

  async addCategory(category: Category) {
    const id = crypto.randomUUID();
    const newCategory = {
      id,
      ...category
    };
    categories.push(newCategory);
    await this.saveCategories();
    return newCategory;
  },

  async updateCategory(id: string, updatedCategory: Category) {
    const index = categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      categories[index] = {...categories[index], ...updatedCategory};
      await this.saveCategories();
      return categories[index];
    }
    throw new Error('Category not found');
  },

  async deleteCategory(id: string) {
    const index = categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      const deleted = categories.splice(index, 1)[0];
      await this.saveCategories();
      return deleted;
    }
    throw new Error('Category not found');
  },

  async getLocations() {
    return locations;
  },

  async addLocation(location: Location) {
    const id = crypto.randomUUID();
    const newLocation = {
      id,
      ...location
    };
    locations.push(newLocation);
    await this.saveLocations();
    return newLocation;
  },

  async updateLocation(id: string, updatedLocation: Location) {
    const index = locations.findIndex(loc => loc.id === id);
    if (index !== -1) {
      locations[index] = {...locations[index], ...updatedLocation};
      await this.saveLocations();
      return locations[index];
    }
    throw new Error('Location not found');
  },

  async deleteLocation(id: string) {
    const index = locations.findIndex(loc => loc.id === id);
    if (index !== -1) {
      const deleted = locations.splice(index, 1)[0];
      await this.saveLocations();
      return deleted;
    }
    throw new Error('Location not found');
  },

  async getItems() {
    return items;
  },

  async getItemById(id: string) {
    return items.find(item => item.id === id);
  },

  async addItem(item: InventoryItem) {
    const id = crypto.randomUUID();
    const newItem = {
      id,
      ...item
    };
    items.push(newItem);
    await this.saveItems();
    return newItem;
  },

  async updateItem(id: string, updatedItem: InventoryItem) {
    const index = items.findIndex(it => it.id === id);
    if (index !== -1) {
      items[index] = {...items[index], ...updatedItem};
      await this.saveItems();
      return items[index];
    }
    throw new Error('Item not found');
  },

  async deleteItem(id: string) {
    const index = items.findIndex(it => it.id === id);
    if (index !== -1) {
      const deleted = items.splice(index, 1)[0];
      await this.saveItems();
      return deleted;
    }
    throw new Error('Item not found');
  },

  async getItemsByCategoryId(categoryId: string) {
    const items: InventoryItem[] = await this.getItems();
    return items.filter(item => item.categoryId === categoryId);
  },

  async getItemsByLocationId(locationId: string) {
    const items: InventoryItem[] = await this.getItems();
    return items.filter(item => item.locationId === locationId);
  },

  async saveCategories() {
    await fs.writeFile(categoriesFileName, JSON.stringify(categories, null, 2));
  },

  async saveLocations() {
    await fs.writeFile(locationsFileName, JSON.stringify(locations, null, 2));
  },

  async saveItems() {
    await fs.writeFile(itemsFileName, JSON.stringify(items, null, 2));
  }
};

export default fileDb;
