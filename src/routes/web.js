const express = require("express");

//import các hàm xử lý ở controllers, ví dụ:
const { getHomepage } = require("../controllers/homeController");

const router = express.Router();

//Khai báo các route, ví dụ:
router.get("/", getHomepage);

module.exports = router;
