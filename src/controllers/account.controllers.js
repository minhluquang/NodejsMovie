const { body, param, validationResult } = require("express-validator");
const {
  getAllAccountsServices,
  getAccountServices,
  createNewAccountServices,
  updateAccountServices,
  deleteAccountServices,
  verifyEmailAddressServices,
  loginServices,
} = require("../services/account.services");

// Get all accounts
const getAllAccounts = async (req, res) => {
  try {
    const getAllAccountsResult = await getAllAccountsServices();
    res.status(getAllAccountsResult.code).send(getAllAccountsResult);
  } catch (error) {
    res
      .status(500)
      .send({ success: false, code: 500, data: { msg: error.message } });
  }
};

// Get one accounts
const getAccount = [
  param("field")
    .isIn(["username", "email"])
    .withMessage("Field must be either 'username' or 'email'"),
  param("value").notEmpty().withMessage("Value must be provided for the field"),

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
      const { field, value } = req.params;
      const getAccountResult = await getAccountServices(field, value);
      res.status(getAccountResult.code).send(getAccountResult);
    } catch (error) {
      res
        .status(500)
        .send({ success: false, code: 500, data: { msg: error.message } });
    }
  },
];

// Create new account
const createNewAccount = [
  body("username")
    .isLength({ min: 4, max: 50 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),
  body("email").isEmail().withMessage("Please enter a valid email address"),

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
      const { username, password, email } = req.body;

      const createNewAccountResult = await createNewAccountServices(
        username,
        password,
        email
      );
      res.status(createNewAccountResult.code).send(createNewAccountResult);
    } catch (error) {
      res
        .status(500)
        .send({ success: false, code: 500, data: { msg: error.message } });
    }
  },
];

// Update an account
const updateAccount = [
  body("username")
    .isLength({ min: 4, max: 50 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("gender")
    .isIn([0, 1, , 2, 3])
    .withMessage("Gender must be one of the following values: 0, 1, 2, 3"),

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
      const {
        username,
        gender,
        name,
        description,
        profile_picture,
        facebook_id,
        instagram_id,
        twitter_id,
      } = req.body;
      const updateAccountResult = await updateAccountServices(
        username,
        gender,
        name,
        description,
        profile_picture,
        facebook_id,
        instagram_id,
        twitter_id
      );
      res.status(updateAccountResult.code).send(updateAccountResult);
    } catch (error) {
      res
        .status(500)
        .send({ success: false, code: 500, data: { msg: error.message } });
    }
  },
];

// Delete an account (active = 0)
const deleteAccount = async (req, res) => {
  try {
    const { account_id } = req.params;
    const deleteAccountResult = await deleteAccountServices(account_id);
    res.status(deleteAccountResult.code).send(deleteAccountResult);
  } catch (error) {
    res
      .status(500)
      .send({ success: false, code: 500, data: { msg: error.message } });
  }
};

// verify the email address
const verifyEmailAddress = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("code")
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage("Code must be exactly 6 digits."),

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
      const { email, code } = req.body;
      const verifyEmailAddressResult = await verifyEmailAddressServices(
        email,
        code
      );
      res.status(verifyEmailAddressResult.code).send(verifyEmailAddressResult);
    } catch (error) {
      res
        .status(500)
        .send({ success: false, code: 500, data: { msg: error.message } });
    }
  },
];

// Get all accounts
const login = [
  body("username")
    .isLength({ min: 4, max: 50 })
    .withMessage("Username must be at least 4 characters long"),
  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),

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
      const { username, password } = req.body;
      const loginResult = await loginServices(username, password);
      res.status(loginResult.code).send(loginResult);
    } catch (error) {
      res
        .status(500)
        .send({ success: false, code: 500, data: { msg: error.message } });
    }
  },
];

module.exports = {
  getAllAccounts,
  getAccount,
  createNewAccount,
  updateAccount,
  deleteAccount,
  verifyEmailAddress,
  login,
};
