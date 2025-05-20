const {
  getFavoriteMediaByAccountIdServices,
  addFavoriteServices,
  deleteFavoriteServices,
} = require("../services/favoriteMedia.services");

// get favorite media by account id
const getFavoriteMediaByAccountId = async (req, res) => {
  try {
    const { sort_by, sort_order } = req.query;
    const accountId = req.user.id;
    const result = await getFavoriteMediaByAccountIdServices(
      accountId,
      sort_by,
      sort_order
    );

    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Add favorite
const addFavorite = async (req, res) => {
  try {
    const { id, type } = req.body;
    const accountId = req.user.id;
    const result = await addFavoriteServices(id, type, accountId);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Delete favorite
const deleteFavorite = async (req, res) => {
  try {
    const { id, type } = req.body;
    const accountId = req.user.id;
    const result = await deleteFavoriteServices(id, type, accountId);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

module.exports = {
  getFavoriteMediaByAccountId,
  addFavorite,
  deleteFavorite,
};
