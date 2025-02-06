import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getInventoryList = async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Error retrieving inventory: ${err}`);
  }
};

const getItemById = async (req, res) => {
  console.log("Request Item ID: ", req.params.id);
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

export { getInventoryList, getItemById };
