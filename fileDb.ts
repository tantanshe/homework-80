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
    await this.save('categories.json', categories);
    return newCategory;
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
    await this.save('locations.json', locations);
    return newLocation;
  },

  async getItems() {
    return items;
  },

  async addItem(item: InventoryItem) {
    const id = crypto.randomUUID();
    const newItem = {
      id,
      ...item
    };
    items.push(newItem);
    await this.save('items.json', items);
    return newItem;
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
