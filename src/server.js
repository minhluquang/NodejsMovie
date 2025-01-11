require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import webRoutes from "./routes/web";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ entended: true }));

//config template engines
viewEngine(app);

//Khai báo route
app.use("/", webRoutes);

const port = process.env.port || 8081;
//port === undefined => port = 8081

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
