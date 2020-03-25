const express = require("express");
const bodyParser = require("body-parser");
const cool = require("cool-ascii-faces");

var app = express();

app.use(bodyParser.json());

var port = process.env.PORT || 80;

app.use("/",express.static("./public"));

app.get("/cool",(request,response) => {
	response.send("<html>"+cool()+"</html>");
});

var contacts = [
	{ 
		name: "Ruben",
		phone: 123456	
	},
	{ 
		name: "Fernando",
		phone: 789456	
	}
];

const BASE_API_URL = "/api/v1";


//GET CONTACTS
app.get(BASE_API_URL+"/contacts", (req,res) =>{
	res.send(JSON.stringify(contacts,null,2));
	console.log("Data sent:"+JSON.stringify(contacts,null,2));
});
//POST CONTACTS
app.post(BASE_API_URL+"/contacts",(req,res) =>{
	contacts.push(req.body); 
	res.sendStatus(201,"CREATED");
});

app.listen(port,() => {
		console.log("Server ready to use    "
					+cool());
});

console.log("Starting server...");