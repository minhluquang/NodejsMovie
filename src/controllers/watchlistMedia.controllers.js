const { body, param, validationResult } = require("express-validator");
const {
  getWatchlistMediaByAccountIdServices,
  deleteWatchlistServices,
  addWatchlistServices,
} = require("../services/watchlistMedia.services");

const getWatchlistMediaByAccountId = async (req, res) => {
  try {
    const { sort_by, sort_order } = req.query;
    const accountId = req.user.id;
    const result = await getWatchlistMediaByAccountIdServices(
      accountId,
      sort_by,
      sort_order
    );
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

const deleteWatchlist = async (req, res) => {
  try {
    const { id, type } = req.body;
    const accountId = req.user.id;
    const result = await deleteWatchlistServices(id, type, accountId);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Add watchlist
const addWatchlist = async (req, res) => {
  try {
    const { id, type } = req.body;
    const accountId = req.user.id;
    const result = await addWatchlistServices(id, type, accountId);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

module.exports = {
  getWatchlistMediaByAccountId,
  deleteWatchlist,
  addWatchlist,
};
