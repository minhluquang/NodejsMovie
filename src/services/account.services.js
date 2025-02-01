require("dotenv").config();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { sendMailServices } = require("./mailer.services");

const {
  Account,
  AccountDetail,
  SocialNetworkDetail,
  EmailConfirmation,
  Role,
  sequelize,
} = require("../models");

const { Op } = require("sequelize");

const {
  getSocialNetworkDetailByAccountIDServices,
  updateSocialNetworkDetailServices,
} = require("./socialNetworkDetail.services");

const {
  getAccountDetailByAccountIDServices,
  updateAccountDetailServices,
} = require("./accountDetail.services");

// Get all account
const getAllAccountsServices = async () => {
  try {
    const accounts = await Account.findAll({
      attributes: { exclude: ["password"] },
    });

    // Return if have no account
    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No accounts found" },
      };
    }

    // Return if have account
    return { success: true, code: 200, data: accounts };
  } catch (error) {
    throw error;
  }
};

// Get one account
const getAccountServices = async (username) => {
  try {
    const account = await Account.findOne({
      where: { username },
      attributes: { exclude: ["password"] },
      include: { model: AccountDetail, as: "account_detail" },
    });

    // Return if have no account
    if (!account || account.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No accounts found" },
      };
    }

    // Return if have account
    return {
      success: true,
      code: 200,
      data: {
        account_id: account.account_id,
        role_id: account.role_id,
        username: account.username,
        email: account.email,
        is_active: account.is_active,
        is_verified: account.is_verified,
        created_at: account.created_at,
        updated_at: account.updated_at,
        account_detail: {
          profile_picture: account.account_detail.profile_picture,
          gender: account.account_detail.gender,
          name: account.account_detail.name,
          description: account.account_detail.description,
          created_at: account.account_detail.created_at,
          updated_at: account.account_detail.updated_at,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

// Create new account
const createNewAccountServices = async (username, password, email) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    // Check if exist username before
    const isExistUsername = await Account.findOne({
      where: { username },
      transaction,
    });

    if (isExistUsername) {
      await transaction.rollback();
      return {
        success: false,
        code: 400,
        data: { type_error: "username_exists", msg: "Username already exists" },
      };
    }

    // Check if exist username before
    const isExistEmail = await Account.findOne({
      where: { email },
      transaction,
    });

    if (isExistEmail) {
      await transaction.rollback();
      return {
        success: false,
        code: 400,
        data: { type_error: "email_exists", msg: "Email already exists" },
      };
    }

    // Hash the password before create a record
    const salt = await bcrypt.genSaltSync(
      Number(process.env.BCRYPT_SALT_ROUND)
    );
    const hashPassword = bcrypt.hashSync(password, salt);

    // Create a new account
    const newAccount = new Account({
      username,
      password: hashPassword,
      email,
      role_id: 1,
      is_active: 1,
      is_verified: 0,
      created_at: sequelize.literal("NOW()"),
      updated_at: sequelize.literal("NOW()"),
      email_verify_at: null,
    });
    await newAccount.save({ transaction });

    // Create a new account_detail
    const newAccountDetail = new AccountDetail({
      account_id: newAccount.account_id,
      created_at: sequelize.literal("NOW()"),
      updated_at: sequelize.literal("NOW()"),
    });
    await newAccountDetail.save({ transaction });

    // Create some social network with null value
    for (let i = 1; i <= 3; i++) {
      const newSocialNetworkDetails = new SocialNetworkDetail({
        social_network_id: i,
        account_id: newAccount.account_id,
        created_at: sequelize.literal("NOW()"),
        updated_at: sequelize.literal("NOW()"),
      });
      await newSocialNetworkDetails.save({ transaction });
    }

    // Create email confirmation
    const newEmailConfirmation = new EmailConfirmation({
      account_id: newAccount.account_id,
      email,
      is_used: 0,
      created_at: sequelize.literal("NOW()"),
      updated_at: sequelize.literal("NOW()"),
    });
    await newEmailConfirmation.save({ transaction });

    await transaction.commit();

    return {
      success: true,
      code: 200,
      data: {
        msg: "Account created successfully",
        account: {
          account_id: newAccount.account_id,
          role_id: newAccount.role_id,
          username: newAccount.username,
          email: newAccount.email,
          is_active: newAccount.is_active,
          is_verified: newAccount.is_verified,
          created_at: new Date(),
          updated_at: new Date(),
          email_verify_at: null,
        },
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Update an account
const updateAccountServices = async (
  username,
  gender,
  name,
  description,
  profile_picture,
  facebook_id,
  instagram_id,
  twitter_id
) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    // Check if exist account before
    const isExistAccount = await Account.findOne({
      where: { username },
      attributes: { exclude: ["password"] },
    });

    if (!isExistAccount) {
      await transaction.rollback();
      return {
        success: false,
        code: 400,
        data: { msg: "No account found" },
      };
    }

    const isExistAccountDetail = await getAccountDetailByAccountIDServices(
      isExistAccount.account_id,
      transaction
    );

    if (!isExistAccountDetail.success) {
      await transaction.rollback();
      return isExistAccountDetail;
    }

    const isExistSocialNetworkDetail =
      await getSocialNetworkDetailByAccountIDServices(
        isExistAccount.account_id
      );

    if (!isExistSocialNetworkDetail.success) {
      await transaction.rollback();
      return isExistSocialNetworkDetail;
    }

    // Update on account_details table
    const updateAccountDetail = await updateAccountDetailServices(
      isExistAccount.account_id,
      name,
      gender,
      description,
      profile_picture,
      transaction
    );

    if (!updateAccountDetail.success) {
      await transaction.rollback();
      return {
        success: false,
        code: 500,
        data: { msg: "Failed to update account details" },
      };
    }

    // Update on social_network_details table
    const socialUpdates = [
      { platform: "facebook", id: facebook_id },
      { platform: "instagram", id: instagram_id },
      { platform: "twitter", id: twitter_id },
    ];

    for (const { platform, id } of socialUpdates) {
      const updateResult = await updateSocialNetworkDetailServices(
        platform,
        "account_id",
        isExistAccount.account_id,
        id,
        transaction
      );
      if (!updateResult.success) {
        await transaction.rollback();
        return updateResult;
      }
    }

    await transaction.commit();
    return {
      success: true,
      code: 200,
      data: {
        msg: "Account updated successfully",
        account: isExistAccount,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Delete an account (active = 0)
const deleteAccountServices = async (account_id) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const account = await Account.findOne({
      where: { account_id },
      attributes: { exclude: ["password"] },
    });

    // Return if have no account
    if (!account || account.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No accounts found" },
      };
    }

    const updateAccount = await Account.update(
      {
        is_active: 0,
        updated_at: sequelize.literal("NOW()"),
      },
      { where: { account_id }, transaction }
    );

    if (updateAccount[0] === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No account found to update." },
      };
    }

    // Return if have account
    return {
      success: true,
      code: 200,
      data: {
        msg: "Account deactivated successfully",
        account: {
          account_id: account.account_id,
          role_id: account.role_id,
          username: account.username,
          email: account.email,
          is_active: 0,
          is_verified: account.is_verified,
          created_at: account.created_at,
          updated_at: account.updated_at,
        },
      },
    };
  } catch (error) {
    transaction.rollback();
    throw error;
  }
};

// Verify OTP email address
const verifyOTPEmailAddressServices = async (email, code) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const account = await Account.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
      transaction,
    });

    // Return if have no account
    if (!account || account.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No account found" },
      };
    }

    // If exist the emai address
    const emailConfirmation = await EmailConfirmation.findOne({
      where: { [Op.and]: [{ account_id: account.account_id, email }] },
      transaction,
    });

    // Return if have no email confirmation
    if (!emailConfirmation || emailConfirmation.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No email confirmation found" },
      };
    }

    if (code === emailConfirmation.confirmation_code) {
      const currentDate = new Date();
      const exprieDate = new Date(emailConfirmation.expires_at);

      if (currentDate.getTime() > exprieDate.getTime()) {
        return {
          success: false,
          code: 400,
          data: { msg: "The code has expired. Please request a new one." },
        };
      }

      // Reset expiration date
      const updateEmailConfirmation = await EmailConfirmation.update(
        {
          expires_at: sequelize.literal("NOW()"),
        },
        {
          where: { [Op.and]: [{ account_id: account.account_id, email }] },
          transaction,
          returning: true,
        }
      );

      if (updateEmailConfirmation[0] === 0) {
        await transaction.rollback();
        return {
          success: false,
          code: 404,
          data: { msg: "No matching email confirmation found to update." },
        };
      }

      const updateAccount = await Account.update(
        {
          is_verified: 1,
          updated_at: sequelize.literal("NOW()"),
        },
        { where: { email }, returning: true, transaction }
      );

      if (updateAccount[0] === 0) {
        await transaction.rollback();
        return {
          success: false,
          code: 404,
          data: { msg: "No matching account found to update." },
        };
      }

      await transaction.commit();

      return {
        success: true,
        code: 200,
        data: {
          msg: "The code is valid.",
          account: {
            account_id: account.account_id,
            role_id: account.role_id,
            username: account.username,
            email: account.email,
            is_active: account.is_active,
            is_verified: 1,
            created_at: account.created_at,
            updated_at: account.updated_at,
          },
        },
      };
    }

    // Return if input wrong
    return {
      success: true,
      code: 400,
      data: { msg: "The code is invalid. Please try again." },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// login
const loginServices = async (username, password) => {
  try {
    const account = await Account.findOne({
      where: { username },
      include: [
        {
          model: Role,
          attributes: ["role"],
        },
      ],
    });

    // Return if have no account
    if (!account || account.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No account found" },
      };
    }

    const isPasswordValid = bcrypt.compareSync(password, account.password);
    if (!isPasswordValid) {
      return {
        success: false,
        code: 401,
        data: { msg: "Invalid credentials" },
      };
    }

    const isVerifiedAccount = account.is_verified === 1;
    if (!isVerifiedAccount) {
      return {
        success: false,
        code: 401,
        data: {
          is_verified: false,
          msg: "Account is not verified. Please check your email for verification.",
        },
      };
    }

    // Gen the access token
    const payload = {
      username: account.username,
      role: account.Role.role,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Return if true username & password
    return {
      success: true,
      code: 200,
      data: {
        msg: "Login successful",
        accessToken,
        username: account.username,
      },
    };
  } catch (error) {
    throw error;
  }
};

// send email to verify
const sendVerifyEmailAddressServices = async (email) => {
  try {
    const account = await Account.findOne({ where: { email } });

    // Return if have no account
    if (!account || account.length === 0) {
      return {
        success: true,
        code: 200,
        data: { msg: "No account found" },
      };
    }

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    // Read content of emailVerification.html
    const emailVerificationTemplate = fs.readFileSync(
      path.join(__dirname, "..", "templates", "emailVerification.html"),
      "utf-8"
    );

    // Change variable in html file
    const emailContent = emailVerificationTemplate
      .replace(/{{username}}/g, account.username)
      .replace(/{{userEmail}}/g, email)
      .replace(/{{emailVerifacationLink}}/g, verificationUrl);

    // Send email
    await sendMailServices(email, "Email verification required", emailContent);
    console.log("Verification email sent to", email);

    return {
      success: true,
      code: 200,
      data: {
        msg: "Send email to verify email successful",
      },
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// verify email address
const verifyEmailAddressServices = async (token) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const account = await Account.findOne({
      where: { email: decoded.email },
      include: [{ model: EmailConfirmation, as: "email_confirmation" }],
    });

    // Return if have no account => token fake
    if (
      !account ||
      account.length === 0 ||
      decoded.email !== account.email_confirmation.email
    ) {
      return { success: false, code: 404, data: { msg: "Invalid token" } };
    }

    if (account.email_confirmation.token_verify_email === token) {
      return {
        success: false,
        code: 400,
        data: { msg: "This token has already been used." },
      };
    }

    const updateAccount = await Account.update(
      {
        is_verified: 1,
        updated_at: sequelize.literal("NOW()"),
        email_verify_at: sequelize.literal("NOW()"),
      },
      { where: { email: account.email }, returning: true, transaction }
    );

    if (updateAccount[0] === 0) {
      await transaction.rollback();
      return {
        success: false,
        code: 404,
        data: { msg: "No matching email found to update." },
      };
    }

    const updateEmailConfirmation = await account.email_confirmation.update(
      {
        token_verify_email: token,
        updated_at: sequelize.literal("NOW()"),
      },
      { where: { email: account.email }, returning: true, transaction }
    );

    if (updateEmailConfirmation[0] === 0) {
      await transaction.rollback();
      return {
        success: false,
        code: 404,
        data: { msg: "No matching email found to update." },
      };
    }

    await transaction.commit();

    return {
      success: true,
      code: 200,
      data: { msg: "Email successfully verified" },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// send email to change password
const verifyChangePasswordServices = async (
  email,
  userIP,
  userLocation,
  userClient
) => {
  try {
    const account = await Account.findOne({ where: { email } });

    // Return if have no account
    if (!account || account.length === 0) {
      return {
        success: true,
        code: 200,
        data: { msg: "No account found" },
      };
    }

    const token = jwt.sign(
      { username: account.username, email: email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const verificationUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Read content of resetPassword.html
    const resetPasswordTemplate = fs.readFileSync(
      path.join(__dirname, "..", "templates", "resetPassword.html"),
      "utf-8"
    );

    // Change variable in html file
    const emailContent = resetPasswordTemplate
      .replace(/{{username}}/g, account.username)
      .replace(/{{userIP}}/g, userIP)
      .replace(/{{userLocation}}/g, userLocation)
      .replace(/{{userClient}}/g, userClient)
      .replace(/{{userEmail}}/g, email)
      .replace(/{{resetPasswordLink}}/g, verificationUrl);

    // Send email
    await sendMailServices(email, "Reset password request", emailContent);
    console.log("Verification change password sent to", email);
    return {
      success: true,
      code: 200,
      data: {
        msg: "Send email to verify change password successful",
      },
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

const resetPasswordServices = async (username, newPassword, token) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const account = await Account.findOne({
      where: { username },
      include: { model: EmailConfirmation, as: "email_confirmation" },
    });

    // Return if have no account
    if (!account || account.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No account found" },
      };
    }

    if (account.email_confirmation.token_change_password === token) {
      return {
        success: false,
        code: 400,
        data: { msg: "The token has already been used." },
      };
    }

    // Update new password
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUND));
    const hashNewPassword = bcrypt.hashSync(newPassword, salt);

    account.password = hashNewPassword;
    account.updated_at = sequelize.literal("NOW()");
    await account.save({ transaction });

    // Store the token into email_confirmation table
    account.email_confirmation.token_change_password = token;
    account.email_confirmation.updated_at = sequelize.literal("NOW()");
    await account.email_confirmation.save({ transaction });

    await transaction.commit();

    // Return if true username & password
    return {
      success: true,
      code: 200,
      data: {
        msg: "Reset password successful",
      },
    };
  } catch (error) {
    transaction.rollback();
    throw error;
  }
};

const checkValidTokenChangePasswordServices = async (token) => {
  try {
    const account = await Account.findOne({
      include: {
        model: EmailConfirmation,
        as: "email_confirmation",
        where: { token_change_password: token },
      },
    });

    // Return if have no account
    if (!account) {
      return {
        success: true,
        code: 200,
        data: {
          msg: "Token is valid",
        },
      };
    }

    // Return if have account
    return {
      success: false,
      code: 400,
      data: {
        msg: "Token has already been used",
        username: account.username,
        email: account.email,
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllAccountsServices,
  getAccountServices,
  createNewAccountServices,
  updateAccountServices,
  deleteAccountServices,
  verifyOTPEmailAddressServices,
  loginServices,
  sendVerifyEmailAddressServices,
  verifyEmailAddressServices,
  resetPasswordServices,
  verifyChangePasswordServices,
  checkValidTokenChangePasswordServices,
};
