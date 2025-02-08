import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getWarehouses = async (_req, res) => {
  try {
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Users: ${err}`);
  }
};

const getWarehouseById = async (req, res) => {
  try {
    const warehouseFound = await knex("warehouses").where({
      id: req.params.id,
    });

    if (warehouseFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const warehouseData = warehouseFound[0];
    res.json(warehouseData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
  }
};

const updateWarehouse = async (req, res) => {
  const warehouseId = req.params.id;

  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const phonePattern = /^\D*?(\d\D*){11}$/;
  const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;

  if (!phonePattern.test(contact_phone)) {
    return res.status(400).json({
      message:
        "Invalid phone number: must contain exactly 11 digits (e.g., +1 (555) 555-5555).",
    });
  }

  if (!emailPattern.test(contact_email)) {
    return res.status(400).json({
      message:
        "Invalid email format: must contain one '@' and follow this format warehouse@example.com.",
    });
  }

  const newWarehouse = {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  };

  try {
    const warehouse = await knex("warehouses")
      .where({ id: warehouseId })
      .first();
    if (!warehouse) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${warehouseId} not found` });
    }

    await knex("warehouses").where({ id: warehouseId }).update(newWarehouse);

    const updatedWarehouse = await knex("warehouses")
      .where({ id: warehouseId })
      .first();
    return res.status(200).json(updatedWarehouse);
  } catch (error) {
    console.log(`Error updating warehouse: ${error}`);
    return res.status(500).json({ message: "Failed to update warehouse" });
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

//post
const createWarehouse = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    res.status(400).json({ message: "All fields required" });
  }

  const phonePattern = /^\D*?(\d\D*){11}$/;
  const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;

  if (!phonePattern.test(contact_phone)) {
    return res.status(400).json({
      message:
        "Invalid phone number: must contain exactly 11 digits (e.g., +1 (555) 555-5555).",
    });
  }

  if (!emailPattern.test(contact_email)) {
    return res.status(400).json({
      message:
        "Invalid email format: must contain one '@' and follow this format warehouse@example.com.",
    });
  }

  try {
    const [newWarehouseId] = await knex("warehouses").insert({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });
    const newWarehouse = await knex("warehouses")
      .where({ id: newWarehouseId })
      .first();
    res.status(201).json(newWarehouse);
  } catch (error) {
    console.log(`Error creating warehouse: ${error}`);
    res.status(500).json({ message: "Failed to create warehouse" });
  }
};

const deleteWarehouse = async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const warehouse = await knex("warehouses")
      .where({ id: warehouseId })
      .first();
    if (!warehouse) {
      return res
        .status(404)
        .json({ message: `warehouse ID ${warehouse} not found` });
    }
    await knex("inventories").where({ warehouse_id: warehouseId }).del();
    await knex("warehouses").where({ id: warehouseId }).del();
    res.status(204).send();
  } catch (error) {
    console.error(`error deleting warehouse:${warehouseId}${error}`);
    res.status(500).json({ message: "Failed to delete warehouse" });
  }
};

export {
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  createWarehouse,
  deleteWarehouse,
  getInventoryByWarehouse,
};
