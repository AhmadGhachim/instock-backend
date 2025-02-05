import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route("/").get(warehouseController.getWarehouses);

router
  .route("/:id")
  .get(warehouseController.getWarehouseById)
  .put(warehouseController.updateWarehouse);

router.route("/").post(warehouseController.createWarehouse);

export default router;
