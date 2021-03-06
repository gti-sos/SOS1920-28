module.exports = function(app){
	console.log("Registering gce API...");
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname,"gce.db");
	const db = new dataStore({
                filename: dbFileName,
				autoload: true
	});
	
	const BASE_API_URL = "/api/v1";
	
	var initialgce = [
	{ 
		country: "EEUU",
		year: 2010,
		gce_country: 5519484,
		gce_per_capita:17.81,
		gce_cars: 12653560
	},
	{ 
		country: "EEUU",
		year: 2012,
		gce_country: 5164192,
		gce_per_capita:16.40,
		gce_cars: 16328884
	}
	,
	{ 
		country: "EEUU",
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
	
	function deleteIDs (gce){
        gce.forEach( (m) => {
            delete m._id;
        });
    }
	
//INITIAL DATA	
app.get(BASE_API_URL+"/gce/loadInitialData",(req,res) =>{
	 console.log("New GET .../loadInitialData");
	 db.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	 db.insert(initialgce);
	 res.sendStatus(200);
	
	console.log("Initial Gce loaded:"+JSON.stringify(initialgce,null,2));
 
});

// GET 
app.get(BASE_API_URL+"/gce", (req,res) =>{
	console.log("New GET gce");
	
	//if(req.query.country) request["country"] = req.query.country;
    if(req.query.year) req.query.year = parseInt(req.query.year);
    if(req.query.gce_country) req.query.gce_country = parseInt(req.query.gce_country);
    if(req.query.gce_per_capita) req.query.gce_per_capita = parseFloat(req.query.gce_per_capita);
    if(req.query.gce_cars) req.query.gce_cars = parseInt(req.query.gce_cars);
	
	var par = req.query;
    console.log(par);
	
	let offset = null;
	let limit = null;
  
    if (req.query.offset) {
        offset = parseInt(req.query.offset);
        delete req.query.offset;
	}
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
        delete req.query.limit;
    }  
	
	
	db.find(par).skip(offset).limit(limit).exec((err, gce)=> {
        deleteIDs(gce);
        res.send(JSON.stringify(gce,null,2));
         
         console.log("Data sent: "+JSON.stringify(gce,null,2));
        });
    });
// GET yyyy/XXX

app.get(BASE_API_URL+"/gce/:country", (req,res)=>{
	var country1 = req.params.country;
	db.find({country: country1}, (err,gce)=>{
		deleteIDs(gce);
		res.send(JSON.stringify(gce,null,2));
		console.log("Data sent:"+JSON.stringify(gce,null,2));
	});
});
	
// GET yyyy/XXX/zzz
app.get(BASE_API_URL+"/gce/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	
	db.find({country: country1, year: Number(year1)}, (err,gce)=>{
		deleteIDs(gce);
		res.send(JSON.stringify(gce[0],null,2));
		console.log("Data sent:"+JSON.stringify(gce[0],null,2));
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
	
//POST yyyy/xxxx
app.post(BASE_API_URL+"/gce/:country",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
//POST yyyy/xxxx/zzzz
app.post(BASE_API_URL+"/gce/:country/:year",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
	
// DELETE 
app.delete(BASE_API_URL+"/gce", (req,res) =>{
	db.remove({}, { multi: true }, function (err, numRemoved) {
		if (numRemoved!=0) {
        	res.sendStatus(200, "DELETED DATA BASE");
    	}else{
        	res.sendStatus(404, "DATA BASE NOT FOUND");
    	}
	});	
});
// DELETE yyyy/XXX

app.delete(BASE_API_URL+"/gce/:country", (req,res)=>{
	
	var country1 = req.params.country;
	
	db.remove({country:country1}, { multi: true }, function (err, numRemoved) {
		if(numRemoved!=0){
			res.sendStatus(200, "DELETED COUNTRY");
    	}else{
        	res.sendStatus(404, "COUNTRY NOT FOUND");
    	}
	});	
});	
// DELETE yyyy/XXX/zzz

app.delete(BASE_API_URL+"/gce/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	db.remove({country:country1, year: Number(year1)}, {}, function (err, numRemoved) {
		if(numRemoved!=0){
			res.sendStatus(200, "DELETED COUNTRY");
    	}else{
        	res.sendStatus(404, "COUNTRY NOT FOUND");
    	}
	});
});	
//PUT yyyy
app.put(BASE_API_URL+"/gce", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});	
// PUT yyyy/XXX/zzz
app.put(BASE_API_URL+"/gce/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	var body = req.body;
	
	db.find({country: country1, year: Number(year1)}, (err, gce) => {
		deleteIDs(gce);
		if(gce.length >= 1){
			db.update({country: country1,year:Number(year1)}, body, (error, numRemoved) => {
				res.sendStatus(200, "OK");
			})
		}else{
			res.sendStatus(404,"ERROR. Pais no encontrado.");
		}
	});
});	
	console.log("GCE OK");  
};