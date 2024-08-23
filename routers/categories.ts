import express from 'express';
import fileDb from '../fileDb';
import {Category} from '../types';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res) => {
  const categories = await fileDb.getCategories();
  const response = categories.map(category => ({
    id: category.id,
    name: category.name,
  }));
  res.send(response);
});

categoriesRouter.get('/:id', async (req, res) => {
  const {id} = req.params;
  const categories = await fileDb.getCategories();
  const category = categories.find(cat => cat.id === id);
  if (category) {
    res.send(category);
  } else {
    res.status(404).send({error: 'Category not found'});
  }
});

categoriesRouter.post('/', async (req, res) => {
  const {name, description}: Category = req.body;
  if (!name) {
    return res.status(400).send({error: 'Name is required'});
  }
  const newCategory = await fileDb.addCategory({name, description});
  res.send(newCategory);
});

categoriesRouter.put('/:id', async (req, res) => {
  const {id} = req.params;
  const updatedCategory: Category = req.body;
  try {
    const category = await fileDb.updateCategory(id, updatedCategory);
    res.send(category);
  } catch (error) {
    res.status(404).send({error: 'Category not found'});
  }
});

categoriesRouter.delete('/:id', async (req, res) => {
  const {id} = req.params;
  const relatedItems = await fileDb.getItemsByCategoryId(id);
  if (relatedItems.length > 0) {
    return res.status(400).send({error: 'Cannot delete category with related items'});
  }
  try {
    await fileDb.deleteCategory(id);
    res.send({message: 'Category deleted'});
  } catch (error) {
    res.status(404).send({error: 'Category not found'});
  }
});

export default categoriesRouter;
