import express from 'express';
import cors from 'cors';

import productRoutes from '../routes/products.js';
import orderRoutes from '../routes/orders.js';
import categoryRoutes from '../routes/categories.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

export default app;