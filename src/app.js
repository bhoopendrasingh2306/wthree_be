// app.js
const express = require("express");
const app = express();
const cors = require("cors");

// require("dotenv").config();
require("./db/config");



app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);

// ======================================================================
console.log("hi ");

const user = require("./routes/user");
app.use("/user", user);


app.listen(process.env.PORT || 5000, function () {
  console.log("App running on port 5000.");
});