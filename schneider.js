const dotenv = require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path')

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

// app api's
app.use("/schnieder/admin", adminRoutes);
app.use("/schnieder/hub", hubRoutes);
app.use("/schnieder/spoke", spokeRoutes);

// Front End
app.use("/", express.static(path.join(__dirname, 'landingpage')));
app.use('/schnieder/hubpage', express.static(path.join(__dirname, 'hubpage')));
app.get('/schnieder/hubpage/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'hubpage', 'index.html'));
});
app.use('/schnieder/adminpage', express.static(path.join(__dirname, 'adminpage')));
app.get('/schnieder/adminpage/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'adminpage', 'index.html'));
});


console.log("Database Connection started !!!");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    if (connection) {
      app.listen(process.env.PORT);
      console.log("\n*********************************************");
      console.log("Database Connected !!!");
      console.log(`Server Is running on Port ${process.env.PORT} !!!`);
      console.log("*********************************************");

    } else {
      console.log("Error while connecting to the database");
    }
  })
  .catch((err) => {
    console.log("Caught database connection error:", err);
  });
