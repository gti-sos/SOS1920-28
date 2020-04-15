const express = require("express");
const bodyParser = require("body-parser");
const cool = require("cool-ascii-faces");
const dataStore = require("nedb");
const path = require("path");
const ppaAPI = require(path.join(__dirname,"ppaAPI"));
const gceAPI = require(path.join(__dirname,"gceAPI"));
const ecAPI = require(path.join(__dirname,"ecAPI"));


const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 80;



//GCE
const dbFileName = path.join(__dirname,"gce.db");
const db = new dataStore({
                filename: dbFileName,
				autoload: true
});

//PPA
const dbFileName1 = path.join(__dirname,"ppa.db");
const db1 = new dataStore({
                filename: dbFileName1,
				autoload: true
});

//EC
const dbFileName2 = path.join(__dirname,"ec.db");
const db2 = new dataStore({
                filename: dbFileName2,
				autoload: true
});

ppaAPI(app,db);
gceAPI(app,db1);
ecAPI(app,db2);

app.use("/",express.static("./public"));

app.get("/cool",(request,response) => {
	response.send("<html>"+cool()+"</html>");
});
const BASE_API_URL = "/api/v1";
	
app.listen(port,() => {
		console.log("Server ready to use    "
					+cool());
});

console.log("Starting server...");
