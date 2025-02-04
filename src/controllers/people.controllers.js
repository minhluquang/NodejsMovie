require("dotenv").config();
const { body, query, validationResult } = require("express-validator");
const { getTopTenPeopleServices } = require("../services/people.services");

// Get all accounts
const getTopTenPeople = async (req, res) => {
  try {
    const { number } = req.params;
    const result = await getTopTenPeopleServices(number);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

module.exports = { getTopTenPeople };
