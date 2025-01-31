import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './api/routes/products';
import authRoutes from './api/routes/auth';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});