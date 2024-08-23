import express from 'express';
import fileDb from '../fileDb';
import {Location} from '../types';

const locationsRouter = express.Router();

locationsRouter.get('/', async (req, res) => {
  const locations = await fileDb.getLocations();
  const response = locations.map(location => ({
    id: location.id,
    name: location.name,
  }));
  res.send(response);
});

locationsRouter.get('/:id', async (req, res) => {
  const {id} = req.params;
  const locations = await fileDb.getLocations();
  const location = locations.find(loc => loc.id === id);
  if (location) {
    res.send(location);
  } else {
    res.status(404).send({error: 'Location not found'});
  }
});

locationsRouter.post('/', async (req, res) => {
  const {name, description}: Location = req.body;
  if (!name) {
    return res.status(400).send({error: 'Name is required'});
  }
  const newLocation = await fileDb.addLocation({name, description});
  res.send(newLocation);
});

locationsRouter.put('/:id', async (req, res) => {
  const {id} = req.params;
  const updatedLocation: Location = req.body;
  try {
    const location = await fileDb.updateLocation(id, updatedLocation);
    res.send(location);
  } catch (error) {
    res.status(404).send({error: 'Location not found'});
  }
});

locationsRouter.delete('/:id', async (req, res) => {
  const {id} = req.params;
  const relatedItems = await fileDb.getItemsByLocationId(id);
  if (relatedItems.length > 0) {
    return res.status(400).send({error: 'Cannot delete location with related items'});
  }
  try {
    await fileDb.deleteLocation(id);
    res.send({message: 'Location deleted'});
  } catch (error) {
    res.status(404).send({error: 'Location not found'});
  }
});

export default locationsRouter;
