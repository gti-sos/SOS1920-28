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

var gce = [
	{ 
		country: "United States of America",
		year: 2010,
		gce_country: 5519484,
		gce_per_capita:17.81,
		gce_cars: 12653560
	},
	{ 
		country: "United States of America",
		year: 2012,
		gce_country: 5164192,
		gce_per_capita:16.40,
		gce_cars: 16328884
	}
	,
	{ 
		country: "United States of America",
		year: 2014,
		gce_country: 5312226,
		gce_per_capita:16.63,
		gce_cars: 22660699
	}
	,
	{ 
		country: "China",
		year: 2010,
		gce_country: 8986614,
		gce_per_capita:3.98,
		gce_cars: 18418876
	}
	,
	{ 
		country: "China",
		year: 2012,
		gce_country: 10056756,
		gce_per_capita:4.20,
		gce_cars: 19271808
	}
	,
	{ 
		country: "China",
		year: 2014,
		gce_country: 10711037,
		gce_per_capita:4.61,
		gce_cars: 22722890
	}
	,
	{ 
		country: "Germany",
		year: 2010,
		gce_country: 811861,
		gce_per_capita:10.09,
		gce_cars: 6311318
	}
	,
	{ 
		country: "Germany",
		year: 2012,
		gce_country: 801677,
		gce_per_capita:9.96,
		gce_cars: 5649269
	}
	,
	{ 
		country: "Germany",
		year: 2014,
		gce_country: 773020,
		gce_per_capita:9.59,
		gce_cars: 5907548
	},
	{ 
		country: "Spain",
		year: 2010,
		gce_country: 284604,
		gce_per_capita:6.11,
		gce_cars: 2353682
	}
	,
	{ 
		country: "Spain",
		year: 2012,
		gce_country: 276360,
		gce_per_capita:5.93,
		gce_cars: 1979179
	}
	,
	{ 
		country: "Spain",
		year: 2014,
		gce_country: 245637,
		gce_per_capita:5.31,
		gce_cars: 2402978
	}
	,
	{ 
		country: "France",
		year: 2010,
		gce_country: 380777,
		gce_per_capita:6.05,
		gce_cars: 2242928
	}
	,
	{ 
		country: "France",
		year: 2012,
		gce_country: 351479,
		gce_per_capita:5.53,
		gce_cars: 1967765
	}
	,
	{ 
		country: "France",
		year: 2014,
		gce_country: 351479,
		gce_per_capita:5.05,
		gce_cars: 1817000
	}
];
var ppa_per_capitas = [
	{ 
		country: "United States of America",
		year: 2017,	
		aas_gross:52988,
		aas_net:39209,
		ppa_per_capita:59531
		
	},
	{ 
		country: "United Kingdom",
		year: 2017,	
		aas_gross:54319,
		aas_net:41599,
		ppa_per_capita:43269
		
	},
	{ 
		country: "Germany",
		year: 2017,	
		aas_gross:63551,
		aas_net:38207,
		ppa_per_capita:50638
		
	},
	{ 
		country: "Spain",
		year: 2017,	
		aas_gross:40451,
		aas_net:31920,
		ppa_per_capita:37998
		
	},
	{ 
		country: "France",
		year: 2017,	
		aas_gross:48339,
		aas_net:34228,
		ppa_per_capita:42850
		
	}
];

const BASE_API_URL = "/api/v1";

// GET 

app.get(BASE_API_URL+"/gce", (req,res) =>{
	res.send(JSON.stringify(gce,null,2));
	console.log("Data sent:"+JSON.stringify(gce,null,2));
});

app.get(BASE_API_URL+"/ppa", (req,res) =>{
	res.send(JSON.stringify(ppa_per_capitas,null,2));
	console.log("Data sent:"+JSON.stringify(ppa_per_capitas,null,2));
});

// POST 

app.post(BASE_API_URL+"/gce",(req,res) =>{
	
	var newContact = req.body;
	
	if((newContact == "") || (newContact.name == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		contacts.push(newContact); 	
		res.sendStatus(201,"CREATED");
	}
});

// DELETE 

// GET yyyy/XXX

app.get(BASE_API_URL+"/gce/:name", (req,res)=>{
	
	var name = req.params.name;
	
	var filteredContacts = contacts.filter((c) => {
		return (c.name == name);
	});
	
	
	if(filteredContacts.length >= 1){
		res.send(filteredContacts[0]);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}
});

// PUT yyyy/XXX

// DELETE yyyy/XXX

app.delete(BASE_API_URL+"/gce/:name", (req,res)=>{
	
	var name = req.params.name;
	
	var filteredContacts = contacts.filter((c) => {
		return (c.name != name);
	});
	
	
	if(filteredContacts.length < contacts.length){
		contacts = filteredContacts;
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}
	
	
});

app.listen(port,() => {
		console.log("Server ready to use    "
					+cool());
});

console.log("Starting server...");