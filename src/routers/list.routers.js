const express = require("express");
const {
  getListByAccountId,
  createNewList,
  updateNewList,
  getListByAccountIdAndListId,
  deleteListByAccountIdAndListId,
} = require("../controllers/list.controllers");
const {
  addMediaIntoList,
  updateMediaList,
  removeMediaFromList,
} = require("../controllers/mediaList.controllers");
const {
  authenticate,
  optionalAuthenticate,
} = require("../middleware/auth/authenticate");

const listRouter = express.Router();

listRouter.get("/", authenticate, getListByAccountId);
listRouter.post("/", authenticate, createNewList);
listRouter.put("/:id", authenticate, updateNewList);
listRouter.get("/:id", optionalAuthenticate, getListByAccountIdAndListId);
listRouter.delete("/:id", authenticate, deleteListByAccountIdAndListId);
listRouter.post("/:id/media", authenticate, addMediaIntoList);
listRouter.put("/:id/media", authenticate, updateMediaList);
listRouter.delete("/:id/media", authenticate, removeMediaFromList);

module.exports = { listRouter };
