const express = require("express");
const { getTopTenPeople } = require("../controllers/people.controllers");

const peopleRouter = express.Router();

peopleRouter.get("/top/:number", getTopTenPeople);

module.exports = { peopleRouter };
