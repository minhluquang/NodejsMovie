const { body, param, validationResult } = require("express-validator");
const {
  addMediaIntoListServices,
  updateMediaListServices,
  removeMediaFromListServices,
} = require("../services/mediaList.services");

// add media into list
const addMediaIntoList = [
  param("id").isInt().withMessage("List ID must be an integer"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        code: 400,
        data: errors.array(),
      });
    }

    try {
      const list_id = req.params.id;
      const { media_id, media_type, description } = req.body;
      const accountId = req.user.id;
      const result = await addMediaIntoListServices(
        list_id,
        media_id,
        media_type,
        accountId,
        description
      );
      res.status(result.code).send(result);
    } catch (error) {
      res.status(500).send({ success: false, data: { msg: error.message } });
    }
  },
];

// update media in list
const updateMediaList = [
  param("id").isInt().withMessage("List ID must be an integer"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, code: 400, data: errors.array() });
    }

    const list_id = req.params.id;
    const { media_id, media_type, description } = req.body;
    const accountId = req.user.id;
    const result = await updateMediaListServices(
      list_id,
      accountId,
      media_id,
      media_type,
      description
    );

    return res.status(result.code).json(result);
  },
];

// remove media from list
const removeMediaFromList = [
  param("id").isInt().withMessage("List ID must be an integer"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, code: 400, data: errors.array() });
    }

    const list_id = req.params.id;
    const { media_id, media_type } = req.body;
    const accountId = req.user.id;
    const result = await removeMediaFromListServices(
      list_id,
      accountId,
      media_id,
      media_type
    );

    return res.status(result.code).json(result);
  },
];

module.exports = {
  addMediaIntoList,
  removeMediaFromList,
  updateMediaList,
};
