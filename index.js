const cool = require("cool-ascii-faces");
const express = require("express");

var app = express();

var port =process.env.PORT || 80;

app.use("/",express.static("./SOS1920-28/public"));

app.get("/cool",(request,response) => {
	response.send("<html>"+cool()+"</html>");
});

app.listen(80,() => {
		console.log("Server ready to use    "
					+cool());
});

console.log("Starting server...");