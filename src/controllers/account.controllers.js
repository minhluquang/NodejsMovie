const { getAllAccountsServices } = require("../services/account.services");

// Lấy toàn bộ danh sách tác giả
const getAllAccounts = async (req, res) => {
  try {
    const getAllAccountsResult = await getAllAccountsServices();
    res.status(getAllAccountsResult.code).send(getAllAccountsResult);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, code: 500, data: { message: error.message } });
  }
};

module.exports = {
  getAllAccounts,
};
