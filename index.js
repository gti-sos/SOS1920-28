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
// GET yyyy/XXX

app.get(BASE_API_URL+"/gce/:country", (req,res)=>{
	
	console.log("New GET .../gce");
	var country1 = req.params.country;
	db.find({country: country1}, (err,gce)=>{
		
		gce.forEach((c)=>{ 
			delete c._id;
		})
		
		res.send(JSON.stringify(gce,null,2));
		
		console.log("Data sent:"+JSON.stringify(gce,null,2));
	});
});


app.get(BASE_API_URL+"/ec/:country", (req,res)=>{
	
	console.log("New GET .../ec");
	var country1 = req.params.country;
	db2.find({country: country1}, (err,ec)=>{
		
		ec.forEach((c)=>{ 
			delete c._id;
		})
		
		res.send(JSON.stringify(ec,null,2));
		
		console.log("Data sent:"+JSON.stringify(ec,null,2));
	});
});
// GET yyyy/XXX/zzz
app.get(BASE_API_URL+"/gce/:country/:year", (req,res)=>{
	
	console.log("New GET .../gce");
	var country1 = req.params.country;
	var year1 = req.params.year;
	db.find({country: country1, year: Number(year1)}, (err,gce)=>{

		gce.forEach((c)=>{ 
			delete c._id;
		})
		
		res.send(JSON.stringify(gce,null,2));
		
		console.log("Data sent:"+JSON.stringify(gce,null,2));
	});
});


app.get(BASE_API_URL+"/ec/:country/:year", (req,res)=>{
	
	console.log("New GET .../ec");
	var country1 = req.params.country;
	var year1 = req.params.year;
	db1.find({country: country1, year: Number(year1)}, (err,ec)=>{
		
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
		db.insert(newGCE); 	
		res.sendStatus(201,"CREATED");
	}
});

app.post(BASE_API_URL+"/ec",(req,res) =>{
	
	var newEC = req.body;
	
	if((newEC == "") || (newEC.country == null)||(newEC.year == null)||(newEC.eev == null)||(newEC.ms == null)||(newEC.eec == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		db1.insert(newEC);	
		res.sendStatus(201,"CREATED");
	}
});
//POST yyyy/xxxx
app.post(BASE_API_URL+"/gce/:country",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});

app.post(BASE_API_URL+"/ec/:country",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});







// DELETE 
app.delete(BASE_API_URL+"/gce", (req,res) =>{
	db.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	res.send("DELETED DATA BASE");
});
app.delete(BASE_API_URL+"/ppa", (req,res) =>{
	db1.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	res.send("DELETED DATA BASE");
});
app.delete(BASE_API_URL+"/ec", (req,res) =>{
	db2.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	res.send("DELETED DATA BASE");
});
// DELETE yyyy/XXX

app.delete(BASE_API_URL+"/gce/:country", (req,res)=>{
	
	var country1 = req.params.country;
	
	db.remove({country:country1}, { multi: true }, function (err, numRemoved) {
		if(numRemoved!=0){
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"COUNTRY NOT FOUND");
	}
	});
	
	
});


app.delete(BASE_API_URL+"/ec/:country", (req,res)=>{
	
	var country1 = req.params.country;
	
	db2.remove({country:country1}, { multi: true }, function (err, numRemoved) {
		if(numRemoved!=0){
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"COUNTRY NOT FOUND");
	}
	});
	
});
// DELETE yyyy/XXX/zzz

app.delete(BASE_API_URL+"/gce/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	db.remove({country:country1, year: Number(year1)}, {}, function (err, numRemoved) {
		if(numRemoved!=0){
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"COUNTRY AND YEAR NOT FOUND");
	}
	});
	
	
});


app.delete(BASE_API_URL+"/ec/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	db2.remove({country:country1, year: Number(year1)}, {}, function (err, numRemoved) {
		if(numRemoved!=0){
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"COUNTRY AND YEAR NOT FOUND");
	}
	});
	
});







//PUT yyyy
app.put(BASE_API_URL+"/gce", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});

app.put(BASE_API_URL+"/ec", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
// PUT yyyy/XXX
app.put(BASE_API_URL+"/gce/:country", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	var body = req.body;
	
	db.find({country1,year1}, (err, gce) => {
		gce.forEach((c) => {
			delete c._id;
		});
		if(gce.length >= 1){
			db.update({country: country1,year:year1}, body, (error, numRemoved) => {
				res.sendStatus(200, "OK");
			})
		}else{
			res.sendStatus(404,"ERROR. Pais no encontrado.");
		}
	});
});
app.put(BASE_API_URL+"/ppa/:country", (req,res)=>{
	
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
	app.put(BASE_API_URL+"/ec/:country", (req,res)=>{
	
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
// PUT yyyy/XXX/zzz
app.put(BASE_API_URL+"/gce/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	var body = req.body;
	
	db.find({country: country1, year: Number(year1)}, (err, gce) => {
		gce.forEach((c) => {
			delete c._id;
		});
		if(gce.length >= 1){
			db.update({country: country1,year:Number(year1)}, body, (error, numRemoved) => {
				res.sendStatus(200, "OK");
			})
		}else{
			res.sendStatus(404,"ERROR. Pais no encontrado.");
		}
	});
});
app.put(BASE_API_URL+"/ppa/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	var body = req.body;
	
	db1.find({country: country1, year: Number(year1)}, (err, ppa) => {
		ppa.forEach((c) => {
			delete c._id;
		});
		if(ppa.length >= 1){
			db1.update({country: country1,year:Number(year1)}, body, (error, numRemoved) => {
				res.sendStatus(200, "OK");
			})
		}else{
			res.sendStatus(404,"ERROR. Pais no encontrado.");
		}
	});
});
	app.put(BASE_API_URL+"/ec/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	var body = req.body;
	
	db2.find({country: country1, year: Number(year1)}, (err, ec) => {
		ec.forEach((c) => {
			delete c._id;
		});
		if(ec.length >= 1){
			db2.update({country: country1,year:Number(year1)}, body, (error, numRemoved) => {
				res.sendStatus(200, "OK");
			})
		}else{
			res.sendStatus(404,"ERROR. Pais no encontrado.");
		}
	});
});






app.listen(port,() => {
		console.log("Server ready to use    "
					+cool());
});

console.log("Starting server...");
