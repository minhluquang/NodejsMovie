const express = require("express");
const { getTopPeople } = require("../controllers/people.controllers");

const peopleRouter = express.Router();

peopleRouter.get("/top/:number", getTopPeople);

module.exports = { peopleRouter };
