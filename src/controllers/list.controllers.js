const { body, param, validationResult } = require("express-validator");
const {
  getListByAccountIdServices,
  createNewListServices,
  updateNewListServices,
  getListByAccountIdAndListIdServices,
  deleteListByAccountIdAndListIdServices,
} = require("../services/list.services");

const getListByAccountId = async (req, res) => {
  try {
    const accountId = req.user.id;
    const result = await getListByAccountIdServices(accountId);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

const createNewList = [
  body("name").isLength({ min: 1, max: 100 }).withMessage("Title is required"),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,

        data: errors.array(),
      });
    }

    try {
      const { name, description, is_public, is_comment, sort_by } = req.body;
      const accountId = req.user.id;
      const result = await createNewListServices(
        accountId,
        name,
        description,
        is_public,
        is_comment,
        sort_by
      );
      res.status(result.code).send(result);
    } catch (error) {
      res.status(500).send({ success: false, data: { msg: error.message } });
    }
  },
];

const updateNewList = [
  param("id").isInt().withMessage("List ID must be an integer"),
  body("name").isLength({ min: 1, max: 100 }).withMessage("Title is required"),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        data: errors.array(),
      });
    }

    try {
      const { id } = req.params;
      const {
        name,
        description,
        is_public,
        is_comment,
        sort_by,
        backdrop_path,
      } = req.body;
      const accountId = req.user.id;
      const result = await updateNewListServices(
        id,
        accountId,
        name,
        description,
        is_public,
        is_comment,
        sort_by,
        backdrop_path
      );
      res.status(result.code).send(result);
    } catch (error) {
      res.status(500).send({ success: false, data: { msg: error.message } });
    }
  },
];

// Get list by account ID
const getListByAccountIdAndListId = [
  param("id").isInt().withMessage("List ID must be an integer"),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        data: errors.array(),
      });
    }

    try {
      const { id } = req.params;
      const { sort_by, show_me } = req.query;
      const accountId = req.user?.id || null;

      const result = await getListByAccountIdAndListIdServices(
        accountId,
        id,
        sort_by,
        show_me
      );
      res.status(result.code).send(result);
    } catch (error) {
      res.status(500).send({ success: false, data: { msg: error.message } });
    }
  },
];

// delete list
const deleteListByAccountIdAndListId = async (req, res) => {
  try {
    const { id } = req.params;
    const accountId = req.user.id;
    const result = await deleteListByAccountIdAndListIdServices(accountId, id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

module.exports = {
  getListByAccountId,
  createNewList,
  updateNewList,
  getListByAccountIdAndListId,
  deleteListByAccountIdAndListId,
};
