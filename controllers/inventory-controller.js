import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getInventoryList = async (_req, res) => {
  try {
    const data = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id") 
      .select("inventories.*", "warehouses.warehouse_name"); 
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Error retrieving inventory: ${error.message}`); 
  }
};

const getItemById = async (req, res) => {

  try {
    const inventoryItem = await knex("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity",
        "warehouses.warehouse_name"
      )
      .where("inventories.id", req.params.id)
      .first();

    if (!inventoryItem) {
      return res.status(404).json({
        message: `Inventory item with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error(`Error retrieving inventory item: ${error.message}`);
    res.status(500).json({
      message: `Unable to retrieve inventory item with ID ${req.params.id}`,
    });
  }
};

const getInventoryByWarehouse = async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const warehouseExists = await knex("warehouses").where("id", warehouseId).first();

    if (!warehouseExists) {
      return res.status(404).json({error: "Warehouse not found"});
    }

    const inventories = await knex("inventories").where("warehouse_id", warehouseId).select("id", "item_name", "category", "status", "quantity");

    res.status(200).json(inventories);

  } catch (error) {
    console.error("Error fetching inventories by warehouse", error);
    res.status(500).json({error: "Internal server error"});
  }
};

export { getInventoryList, getItemById, getInventoryByWarehouse };
