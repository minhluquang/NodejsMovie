const express = require("express");
const {
  getListByAccountId,
  createNewList,
  updateNewList,
  getListByAccountIdAndListId,
  addMediaIntoList,
} = require("../controllers/list.controllers");
const { authenticate } = require("../middleware/auth/authenticate");

const listRouter = express.Router();

listRouter.get("/", authenticate, getListByAccountId);
listRouter.post("/", authenticate, createNewList);
listRouter.put("/:id", authenticate, updateNewList);
listRouter.get("/:id", authenticate, getListByAccountIdAndListId);
listRouter.post("/:id/media", authenticate, addMediaIntoList);

module.exports = { listRouter };
