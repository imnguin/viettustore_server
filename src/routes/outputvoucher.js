import express from 'express';
import { outputvoucherController } from '../controllers/outputvoucherController.js';

const router = express.Router();
const path = '/api/outputvoucher';
router.post('/search',  outputvoucherController.search);
router.post('/add', outputvoucherController.insert);

export const outputvoucherRouter = {
    path,
    router
};