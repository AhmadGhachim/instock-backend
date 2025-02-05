import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getInventoryList = async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.status(200).json(data);
  } catch (error) {}
};

export {};
