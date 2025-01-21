require("dotenv").config();
const express = require("express");
const viewEngine = require("./config/viewEngine");
const { rootRouter } = require("./routers");
const connectDB = require("./config/connectDB");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//config template engines
viewEngine(app);

//Khai báo route
app.use("/api/v1", rootRouter);

connectDB();

const port = process.env.port || 8686;
//port === undefined => port = 8081

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
