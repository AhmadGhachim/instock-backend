import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);


const getWarehouses = async (_req, res) => {
    try {
        const data = await knex('warehouses');
        res.status(200).json(data);
    } catch(err) {
        res.status(400).send(`Error retrieving Users: ${err}`)
    }
}

const getWarehouseById = async (req, res) => {
    try {
        const warehouseFound = await knex("warehouses")
            .where({ id: req.params.id });

        if (warehouseFound.length === 0) {
            return res.status(404).json({
                message: `Warehouse with ID ${req.params.id} not found`
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

export { getWarehouses, getWarehouseById, updateWarehouse };
