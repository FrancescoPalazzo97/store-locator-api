import { Router } from "express";
import { getServerHealth } from "../controllers/healthController.js";

const router = Router();

router.get('/', getServerHealth);

export default router;