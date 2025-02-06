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
    const warehouseExists = await knex("warehouses")
      .where("id", warehouseId)
      .first();

    if (!warehouseExists) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    const inventories = await knex("inventories")
      .where("warehouse_id", warehouseId)
      .select("id", "item_name", "category", "status", "quantity");

    res.status(200).json(inventories);
  } catch (error) {
    console.error("Error fetching inventories by warehouse", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createInventoryItem = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    quantity === undefined
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (isNaN(quantity)) {
    return res.select(400).json({ message: "Quantity should be a number" });
  }

  try {
    const warehouseExists = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ message: "Invalid warehouse id" });
    }
    const [newInventoryId] = await knex("inventories").insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    const newInventoryItem = await knex("inventories")
      .where({ id: newInventoryId })
      .first();
    res.status(201).json(newInventoryItem);
  } catch (error) {
    console.log(`Error creating inventory item: ${error}`);
    res.status(500).json({ message: "Failed to create inventory item" });
  }
};


const editInventoryItem = async (req, res) => {
  const inventoryItemID = req.params.id;

  const { item_name, description, category, status, quantity, warehouse_name } =
    req.body;

  if (
    !item_name ||
    !description ||
    !category ||
    !status ||
    !quantity ||
    !warehouse_name
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newInventoryItem = { item_name, description, category, status, quantity, warehouse_name };

  try {
    const inventoryItem = await knex("inventories")
      .where({ id: inventoryItemID })
      .first(); 

    if (!inventoryItem) {
      return res.status(404).json({ message: "Could not find inventory item" });
    }

    await knex("inventories").where({ id: inventoryItemID }).update(newInventoryItem);

    const updatedInventoryItem = await knex("inventories")
      .where({ id: inventoryItemID })
      .first();

    return res.status(200).json(updatedInventoryItem);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  const inventoryId = req.params.id;

  try {
    const inventoryItem = await knex("inventories")
      .where({ id: inventoryId })
      .first();
    if (!inventoryItem) {
      return res.status(404).json({
        message: `Inventory item with ID ${inventoryId} not found`,
      });
    }
    await knex("inventories").where({ id: inventoryId }).del();
    return res.status(204).send();
  } catch (error) {
    console.error(`error deleting inventory item${error}`);
    res.status(500).json({ message: "Failed to delete inventory item" });
  }
};

export {
  getInventoryList,
  getItemById,
  getInventoryByWarehouse,
  createInventoryItem,
  editInventoryItem,
  deleteInventoryItem
};
