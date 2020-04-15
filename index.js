const express = require("express");
const bodyParser = require("body-parser");
const cool = require("cool-ascii-faces");
const dataStore = require("nedb");
const path = require("path");
const ppaAPI = require(path.join(__dirname,"ppaAPI"));
const gceAPI = require(path.join(__dirname,"gceAPI"));
const ecAPI = require(path.join(__dirname,"ecAPI"));
const app = express();


console.log("Running module...")

app.use(bodyParser.json());
const port = process.env.PORT || 80;

ppaAPI(app);
gceAPI(app);
ecAPI(app);

app.use("/",express.static("./public"));

app.get("/cool",(request,response) => {
	response.send("<html>"+cool()+"</html>");
});

	
app.listen(port,() => {
		console.log("Server ready to use    "
					+cool());
});

console.log("Starting server...");
