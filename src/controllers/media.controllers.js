const { body, param, validationResult } = require("express-validator");
const { getTrendingMediasServices } = require("../services/media.services");

// Get movie trending (today/this week)
const getTrendingMedias = [
  param("type")
    .isIn(["today", "week"])
    .withMessage(
      "Invalid 'type' value. Accepted values are 'today' or 'week'."
    ),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        data: errors.array(),
      });
    }

    const { type } = req.params;
    try {
      const result = await getTrendingMediasServices(type);
      res.status(result.code).send(result);
    } catch (error) {
      res.status(500).send({ success: false, data: { msg: error.message } });
    }
  },
];

module.exports = {
  getTrendingMedias,
};
