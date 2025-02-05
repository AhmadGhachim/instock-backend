import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route('/').get(warehouseController.getWarehouses);

router.route('/:id').get(warehouseController.getWarehouseById).put(warehouseController.updateWarehouse);

export default router;