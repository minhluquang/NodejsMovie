const { body, param, validationResult } = require("express-validator");
const {
  getRatingMediaByAccountIdServices,
  addRatingServices,
  updateRatingServices,
  deleteRatingServices,
} = require("../services/ratingMedia.services");

// Add rating
const addRating = [
  body("rating")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be a number between 0 and 5."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        data: errors.array(),
      });
    }

    try {
      const { id, type, rating } = req.body;
      const accountId = req.user.id;
      const result = await addRatingServices(id, type, rating, accountId);
      res.status(result.code).send(result);
    } catch (error) {
      res.status(500).send({ success: false, data: { msg: error.message } });
    }
  },
];

// Update rating
const updateRating = [
  body("rating")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be a number between 0 and 5."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        data: errors.array(),
      });
    }

    try {
      const { id, type, rating } = req.body;
      const accountId = req.user.id;
      const result = await updateRatingServices(id, type, rating, accountId);
      res.status(result.code).send(result);
    } catch (error) {
      res.status(500).send({ success: false, data: { msg: error.message } });
    }
  },
];

// Delete rating
const deleteRating = async (req, res) => {
  try {
    const { id, type } = req.body;
    const accountId = req.user.id;
    const result = await deleteRatingServices(id, type, accountId);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Get rating media by account ID
const getRatingMediaByAccountId = async (req, res) => {
  try {
    const { sort_by, sort_order } = req.query;
    const accountId = req.user.id;
    const result = await getRatingMediaByAccountIdServices(
      accountId,
      sort_by,
      sort_order
    );
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};
module.exports = {
  getRatingMediaByAccountId,
  addRating,
  updateRating,
  deleteRating,
};
