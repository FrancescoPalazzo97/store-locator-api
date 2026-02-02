import { Router } from "express";
import storeRoutes from './storeRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use('/stores', storeRoutes);

router.use('/health', healthRoutes);

export default router;