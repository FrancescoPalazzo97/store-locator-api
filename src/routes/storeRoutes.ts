import { Router } from "express";
import { getStores, getCities, getStoreById } from "../controllers/storeController.js";

const router = Router();

router.get('/cities', getCities);
router.get('/', getStores);
router.get('/:id', getStoreById);

export default router;