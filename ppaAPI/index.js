module.exports = function(app){
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname,"ppa.db");
	const db1 = new dataStore({
                filename: dbFileName,
				autoload: true
});
	
	const BASE_API_URL = "/api/v1";
	var initialppa = [
	{ 
		country: "United States of America",
		year: 2017,	
		aas_gross:52988,
		aas_net:39209,
		ppa_per_capita:59531
		
	},
	{ 
		country: "Spain",
		year: 2019,	
		aas_gross:40451,
		aas_net:31920,
		ppa_per_capita:37998
		
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
	
	
	
	
//GET
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
// GET yyyy/XXX
app.get(BASE_API_URL+"/ppa/:country", (req,res)=>{
	
	console.log("New GET .../ppa");
	var country1 = req.params.country;
	db1.find({country: country1}, (err,ppa)=>{
		
		ppa.forEach((c)=>{ 
			delete c._id;
		})
		
		res.send(JSON.stringify(ppa,null,2));
		
		console.log("Data sent:"+JSON.stringify(ppa,null,2));
	});
});
// GET yyyy/XXX/zzz
app.get(BASE_API_URL+"/ppa/:country/:year", (req,res)=>{
	
	console.log("New GET .../ppa");
	var country1 = req.params.country;
	var year1 = req.params.year;
	db1.find({country: country1, year: Number(year1)}, (err,ppa)=>{
		
		ppa.forEach((c)=>{ 
			delete c._id;
		})
		
		res.send(JSON.stringify(ppa,null,2));
		
		console.log("Data sent:"+JSON.stringify(ppa,null,2));
	});
});



// POST 
app.post(BASE_API_URL+"/ppa",(req,res) =>{
	
	var newPPA = req.body;
	
	if((newPPA == "") || (newPPA.country == null)||(newPPA.year == null)||(newPPA.aas_gross == null)||(newPPA.aas_net == null)||(newPPA.ppa_per_capita == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		db1.insert(newPPA); 	
		res.sendStatus(201,"CREATED");
	}
});
//POST yyyy/xxxx
app.post(BASE_API_URL+"/ppa/:country",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});

	

// DELETE
app.delete(BASE_API_URL+"/ppa", (req,res) =>{
	db1.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	res.send("DELETED DATA BASE");
});
// DELETE yyyy/XXX
app.delete(BASE_API_URL+"/ppa/:country", (req,res)=>{
	
	var country1 = req.params.country;
	
	db1.remove({country:country1}, { multi: true }, function (err, numRemoved) {
		if(numRemoved!=0){
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"COUNTRY NOT FOUND");
	}
	});
	
	
});
// DELETE yyyy/XXX/zzz
app.delete(BASE_API_URL+"/ppa/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	db1.remove({country:country1, year: Number(year1)}, {}, function (err, numRemoved) {
		if(numRemoved!=0){
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"COUNTRY AND YEAR NOT FOUND");
	}
	});
	
	
});

	
	
//PUT yyyy
app.put(BASE_API_URL+"/ppa", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
// PUT yyyy/XXX
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
// PUT yyyy/XXX/zzz
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
	
	
	
};
