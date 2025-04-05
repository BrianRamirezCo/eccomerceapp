import express from 'express';
import productRoutes from './productsRoutes.js'
import userRoutes from './userRoutes.js';

const router = express.Router();


router.use('/user', userRoutes);

router.use('/product', productRoutes);

export default router;