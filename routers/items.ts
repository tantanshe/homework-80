import express from 'express';
import fileDb from '../fileDb';
import {InventoryItem} from '../types';
import {imagesUpload} from '../multer';

const itemsRouter = express.Router();

itemsRouter.get('/', async (req, res) => {
  const items = await fileDb.getItems();
  const response = items.map(item => ({
    id: item.id,
    name: item.name,
  }));
  res.send(response);
});

itemsRouter.get('/:id', async (req, res) => {
  const {id} = req.params;
  const items = await fileDb.getItems();
  const item = items.find(it => it.id === id);
  if (item) {
    res.send(item);
  } else {
    res.status(404).send({error: 'Item not found'});
  }
});

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  const {categoryId, locationId, name, description} = req.body;
  if (!categoryId || !locationId || !name) {
    return res.status(400).send({error: 'Category ID, Location ID, and Name are required.'});
  }
  const item: InventoryItem = {
    categoryId,
    locationId,
    name,
    description: description || '',
    image: req.file ? req.file.filename : null,
    createdAt: new Date().toISOString(),
  };
  const newItem = await fileDb.addItem(item);
  res.send(newItem);
});

itemsRouter.put('/:id', imagesUpload.single('image'), async (req, res) => {
  const {id} = req.params;
  const updatedItem: InventoryItem = {
    ...req.body,
    image: req.file ? req.file.filename : req.body.image,
  };
  try {
    const item = await fileDb.updateItem(id, updatedItem);
    res.send(item);
  } catch (error) {
    res.status(404).send({error: 'Item not found'});
  }
});

itemsRouter.delete('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    await fileDb.deleteItem(id);
    res.send({message: 'Item deleted'});
  } catch (error) {
    res.status(404).send({error: 'Item not found'});
  }
});

export default itemsRouter;
