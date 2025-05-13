require("dotenv").config();
const express = require("express");
const viewEngine = require("./config/viewEngine");
const { rootRouter } = require("./routers");
const connectDB = require("./config/connectDB");
const cors = require("cors");

const app = express();
app.set("trust proxy", true);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use((req, res, next) => {
  console.log(`>>> ${req.method} ${req.originalUrl}`);
  next();
});

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
