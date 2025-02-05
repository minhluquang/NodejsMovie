require("dotenv").config();
const { body, query, validationResult } = require("express-validator");
const { getTopPeopleServices } = require("../services/people.services");

// Get all accounts
const getTopPeople = async (req, res) => {
  try {
    const { number } = req.params;
    const result = await getTopPeopleServices(number);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

module.exports = { getTopPeople };
