import express from 'express';
import fileDb from './fileDb';
import categoriesRouter from './routers/categories';
import locationsRouter from './routers/locations';
import itemsRouter from './routers/items';

const app = express();
const port = 8002;

app.use(express.json());
app.use(express.static('public'));
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
app.use('/items', itemsRouter);

const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

run().catch(console.error);