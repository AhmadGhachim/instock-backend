import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js";

const router = express.Router();

router.route("/").get(inventoryController.getInventoryList);
router.route("/:id").get(inventoryController.getItemById);


export default router;