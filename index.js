const express = require("express");
const bodyParser = require("body-parser");
const path = require ("path");
const ppaAPI =require(path.join(__dirname,"./src/back/ppaAPI"));
const gceAPI =require(path.join(__dirname,"./src/back/gceAPI"));

var app = express();

app.use(bodyParser.json());


ppaAPI(app);
gceAPI(app);

var port = process.env.PORT || 9999;

app.use("/", express.static("./public"));

app.listen(port, () => {
    console.log("Server ready on port " + port);
});

console.log("Starting server...");