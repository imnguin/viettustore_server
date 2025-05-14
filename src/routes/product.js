import express from 'express';
import { productController } from '../controllers/productController.js';

const router = express.Router();
const path = '/api/product';

router.post('/add', productController.insert);
router.post('/update', productController.update);
router.post('/search',  productController.search);
router.post('/load',  productController.load);
router.post('/delete', productController.deleted);

export const productRouter = {
    path,
    router
};
