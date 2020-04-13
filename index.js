const express = require("express");
const bodyParser = require("body-parser");
const cool = require("cool-ascii-faces");
const dataStore = require("nedb");
const path = require("path");

var app = express();

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

app.use("/",express.static("./public"));

app.get("/cool",(request,response) => {
	response.send("<html>"+cool()+"</html>");
});
const BASE_API_URL = "/api/v1";



var initialgce = [
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
app.get(BASE_API_URL+"/gce/loadInitialData",(req,res) =>{
	 console.log("New GET .../loadInitialData");
	 db.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	 db.insert(initialgce);
	 res.sendStatus(200);
	
	console.log("Initial Gce loaded:"+JSON.stringify(initialgce,null,2));
 
});

var initialppa = [
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

app.get(BASE_API_URL+"/ppa/loadInitialData",(req,res) =>{
	 console.log("New GET .../loadInitialData");
	 db1.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	 db1.insert(initialppa);
	 res.sendStatus(200);
	
	console.log("Initial Ppa loaded:"+JSON.stringify(initialppa,null,2));
 
});



var initialec =[
	{
		country: "Sweden",
		year: 2014,
		eev:8076,
		ms:1.53,
		eec:135002
	},
	{
		country: "France",
		year: 2014,
		eev:43605,
		ms:1.2,
		eec:489944
	},
	{
		country: "United Kingdom",
		year: 2014,
		eev:24500,
		ms:1.1,
		eec:345068
	},
	{
		country: "United States",
		year: 2014,
		eev:291332,
		ms:0.72,
		eec:172000
	},
	{
		country: "China",
		year: 2014,
		eev:83198,
		ms:0.23,
		eec:28619
	}
	
];

app.get(BASE_API_URL+"/ec/loadInitialData",(req,res) =>{
 console.log("New GET .../loadInitialData");
 	db2.remove({}, { multi: true }, function (err, numRemoved) {
	 });
	db2.insert(initialec);
	res.sendStatus(200);
	
 console.log("Initial Ec loaded:"+JSON.stringify(initialec,null,2));
});


// GET 

app.get(BASE_API_URL+"/gce", (req,res) =>{
	console.log("New GET .../gce");
	
	db.find({}, (err,gce)=>{
		
		gce.forEach((c)=>{ 
			delete c._id;
		})
		
		res.send(JSON.stringify(gce,null,2));
		
		console.log("Data sent:"+JSON.stringify(gce,null,2));
	});
});

app.get(BASE_API_URL+"/ppa", (req,res) =>{
	console.log("New GET .../ppa");
	
	db1.find({}, (err,ppa)=>{
		
		ppa.forEach((c)=>{ 
			delete c._id;
		})
		
		res.send(JSON.stringify(ppa,null,2));
		
		console.log("Data sent:"+JSON.stringify(ppa,null,2));
	});
});

app.get(BASE_API_URL+"/ec", (req,res) =>{
	console.log("New GET .../ec");
	
	db2.find({}, (err,ec)=>{
		
		ec.forEach((c)=>{ 
			delete c._id;
		})
		
		res.send(JSON.stringify(ec,null,2));
		
		console.log("Data sent:"+JSON.stringify(ec,null,2));
	});
});
// POST 
app.post(BASE_API_URL+"/gce",(req,res) =>{
	var newGCE = req.body;
	if((newGCE == "") || (newGCE.country == null)||(newGCE.year == null)||(newGCE.gce_country == null)||(newGCE.gce_per_capita == null)||(newGCE.gce_cars == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		gce.push(newGCE); 	
		res.sendStatus(201,"CREATED");
	}
});
app.post(BASE_API_URL+"/ppa",(req,res) =>{
	
	var newPPA = req.body;
	
	if((newPPA == "") || (newPPA.country == null)||(newPPA.year == null)||(newPPA.aas_gross == null)||(newPPA.aas_net == null)||(newPPA.ppa_per_capita == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		ppa_per_capitas.push(newPPA); 	
		res.sendStatus(201,"CREATED");
	}
});
app.post(BASE_API_URL+"/ec",(req,res) =>{
	
	var newEC = req.body;
	
	if((newEC == "") || (newEC.country == null)||(newEC.year == null)||(newEC.eev == null)||(newEC.ms == null)||(newEC.eec == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		ec.push(newEC); 	
		res.sendStatus(201,"CREATED");
	}
});
// DELETE 
app.delete(BASE_API_URL+"/gce", (req,res) =>{
	var newGCE = req.body;
	gce = newGCE;
	res.send("DELETED DATA BASE");
});
app.delete(BASE_API_URL+"/ppa", (req,res) =>{
	var newPPA = req.body;
	ppa_per_capitas = newPPA;
	res.send("DELETED DATA BASE");
});
app.delete(BASE_API_URL+"/ec", (req,res) =>{
	var newEC = req.body;
	ec = newEC;
	res.send("DELETED DATA BASE");
});
	
// GET yyyy/XXX

app.get(BASE_API_URL+"/gce/:country", (req,res)=>{
	
	var country = req.params.country;
	
	var filteredCountry = gce.filter((c) => {
		return (c.country == country);
	});
	
	
	if(filteredCountry.length >= 1){
		res.send(filteredCountry);
	}else{
		res.sendStatus(404,"COUNTRY NOT FOUND");
	}
});

app.get(BASE_API_URL+"/ppa/:country", (req,res)=>{
	
	var country = req.params.country;
	
	var filteredCountry = ppa_per_capitas.filter((c) => {
		return (c.country == country);
	});
	
	
	if(filteredCountry.length >= 1){
		res.send(filteredCountry);
	}else{
		res.sendStatus(404,"COUNTRY NOT FOUND");
	}
});
app.get(BASE_API_URL+"/ec/:country", (req,res)=>{
	
	var country = req.params.country;
	
	var filteredCountry = ec.filter((c) => {
		return (c.country == country);
	});
	
	
	if(filteredCountry.length >= 1){
		res.send(filteredCountry);
	}else{
		res.sendStatus(404,"COUNTRY NOT FOUND");
	}
});

// PUT yyyy/XXX
app.put(BASE_API_URL+"/gce/:country/:year", (req,res)=>{
	
	var country = req.params.country;
	var year = req.params.year;
	var newCountryYear= req.body;
	var filteredCountryYear = gce.filter((c) => {
		return (c.country == country&&c.year==year);
	});
	if(filteredCountryYear.length==1){
		var updateData = gce.map((e) => {
			var upData = e;
			if(e.country==country && e.year==year){
				for(var p in newCountryYear){
					upData[p] = newCountryYear[p];
				}
			}
			return(updateData);
		});
		
		gce.push(updateData);
		res.sendStatus(200,"Data Modified");
	}else{
		res.sendStatus(404,"Data Not Found");
	}
});
app.put(BASE_API_URL+"/ppa/:country/:year", (req,res)=>{
	
	var country = req.params.country;
	var year = req.params.year;
	var newCountryYear= req.body;
	var filteredCountryYear = ppa_per_capitas.filter((c) => {
		return (c.country == country&&c.year==year);
	});
	if(filteredCountryYear.length==1){
		var updateData = ppa_per_capitas.map((e) => {
			var upData = e;
			if(e.country==country && e.year==year){
				for(var p in newCountryYear){
					upData[p] = newCountryYear[p];
				}
			}
			return(updateData);
		});
		
		ppa_per_capitas.push(updateData);
		res.sendStatus(200,"Data Modified");
	}else{
		res.sendStatus(404,"Data Not Found");
	}
});
	app.put(BASE_API_URL+"/ec/:country/:year", (req,res)=>{
	
	var country = req.params.country;
	var year = req.params.year;
	var newCountryYear= req.body;
	var filteredCountryYear = ec.filter((c) => {
		return (c.country == country&&c.year==year);
	});
	if(filteredCountryYear.length==1){
		var updateData = ec.map((e) => {
			var upData = e;
			if(e.country==country && e.year==year){
				for(var p in newCountryYear){
					upData[p] = newCountryYear[p];
				}
			}
			return(updateData);
		});
		
		ec.push(updateData);
		res.sendStatus(200,"Data Modified");
	}else{
		res.sendStatus(404,"Data Not Found");
	}
});
// DELETE yyyy/XXX

app.delete(BASE_API_URL+"/gce/:country", (req,res)=>{
	
	var country = req.params.country;
	
	var filteredCountry = gce.filter((c) => {
		return (c.country != country);
	});
	
	
	if(filteredCountry.length < gce.length){
		gce = filteredCountry;
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"COUNTRY NOT FOUND");
	}
	
	
});

app.delete(BASE_API_URL+"/ppa/:country", (req,res)=>{
	
	var country = req.params.country;
	
	var filteredCountry = ppa_per_capitas.filter((c) => {
		return (c.country != country);
	});
	
	
	if(filteredCountry.length < ppa_per_capitas.length){
		ppa_per_capitas = filteredCountry;
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"COUNTRY NOT FOUND");
	}
	
});
app.delete(BASE_API_URL+"/ec/:country", (req,res)=>{
	
	var country = req.params.country;
	
	var filteredCountry = ec.filter((c) => {
		return (c.country != country);
	});
	
	
	if(filteredCountry.length < ec.length){
		ec = filteredCountry;
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"COUNTRY NOT FOUND");
	}
	
});
//POST yyyy/xxxx
app.post(BASE_API_URL+"/gce/:country",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
app.post(BASE_API_URL+"/ppa/:country",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
app.post(BASE_API_URL+"/ec/:country",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});

//PUT yyyy
app.put(BASE_API_URL+"/gce", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
app.put(BASE_API_URL+"/ppa", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
app.put(BASE_API_URL+"/ec", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});



app.listen(port,() => {
		console.log("Server ready to use    "
					+cool());
});

console.log("Starting server...");
