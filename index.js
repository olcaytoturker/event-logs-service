const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const db = require("./utils/dbInit");

var corsOptions = {
  origin: "http://localhost:3071"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Event Log routes are imported.
require('./routes/eventLogs.routes')(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Event Logs application." });
});


//set up Database
db.initialize();
// set port, listen for requests
const PORT = process.env.PORT || 3070;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});