import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js";

const router = express.Router();

router
  .route("/")
  .get(inventoryController.getInventoryList)
  .post(inventoryController.createInventoryItem);
router
  .route("/:id")
  .get(inventoryController.getItemById)
  .delete(inventoryController.deleteInventoryItem);

export default router;
