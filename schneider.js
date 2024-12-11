const dotenv = require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const webRoutes = require("./routes/web");
const adminRoutes = require("./routes/admin");
const hubRoutes = require("./routes/hubApp");
const spokeRoutes = require("./routes/spokesApp");

app.use(bodyParser.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(["google.com", "domain"])); // Use cors middleware directly

function setupCORS(req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "token, X-Requested-With, Content-type, Accept, X-Access-Token, X-Key"
  );
  res.header("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
}

app.all("/*", setupCORS);

// const frontend = express.Router(); 

// Use the static middlewares within the router
// frontend.use("/", express.static(__dirname + "dist"));
// frontend.use("/hub", express.static(__dirname + "/adminFrontEnd"));

app.use("/", express.static(__dirname + "/adminpage"));
// app.use("/*", express.static(__dirname + "/dist"));

// app api's
// app.use("/v1/api", apiRoutes);
app.use("/admin", adminRoutes);
app.use("/hub", hubRoutes);

//console.log("Database Connection started !!!");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    if (connection) {
      app.listen(process.env.PORT);
      //console.log("Database Connected !!!");
      //console.log(`admin server running on ${process.env.PORT} !!!`);
    } else {
      //console.log("Error while connecting to the database");
    }
  })
  .catch((err) => {
    //console.log("Caught database connection error:", err);
  });
