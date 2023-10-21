const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { config } = require("dotenv");
config({ path: "./config/config.env" });
const DBConnect = require("./config/connect");

const userRouter = require("./route/user");
const groupRouter = require("./route/group");
const transRouter = require("./route/transaction");

const app = express();
DBConnect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());


app.get("/", (req, resp) => {
    resp.send("<h1>App Started.....</h1>");
});
app.use("/upload", express.static("./upload"));

app.use("/api/v1/user", userRouter);

app.use("/api/v1/group", groupRouter);

app.use("/api/v1/transaction", transRouter);



app.listen(process.env.PORT);
console.warn(`Server Started : http://localhost:${process.env.PORT}`);