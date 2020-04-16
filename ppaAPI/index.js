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
	
function deleteIDs (ppa){
        ppa.forEach( (m) => {
            delete m._id;
        });
    }
	
	
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
	
	//if(req.query.country) request["country"] = req.query.country;
	if(req.query.year) req.query.year = parseInt(req.query.year);
    if(req.query.aas_gross) req.query.aas_gross = parseInt(req.query.aas_gross);
    if(req.query.aas_net) req.query.aas_net = parseInt(req.query.aas_net);
    if(req.query.ppa_per_capita) req.query.ppa_per_capita = parseInt(req.query.ppa_per_capita);
    
	var params = req.query;
        console.log(params);
        
    //Paginacion
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
        
        db1.find(params).skip(offset).limit(limit).exec((err, ppa)=> {
        deleteIDs(ppa);
        res.send(JSON.stringify(ppa,null,2));
         
         console.log("Data sent: "+JSON.stringify(ppa,null,2));
        });
});
// GET yyyy/XXX
app.get(BASE_API_URL+"/ppa/:country", (req,res)=>{
	
	var country1 = req.params.country;
	db1.find({country: country1}, (err,ppa)=>{
		deleteIDs(ppa);
		res.send(JSON.stringify(ppa,null,2));
		
		console.log("Data sent:"+JSON.stringify(ppa,null,2));
	});
});
// GET yyyy/XXX/zzz
app.get(BASE_API_URL+"/ppa/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	db1.find({country: country1, year: Number(year1)}, (err,ppa)=>{
		deleteIDs(ppa);
		res.send(JSON.stringify(ppa[0],null,2));
		
		console.log("Data sent:"+JSON.stringify(ppa[0],null,2));
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
//POST yyyy/xxxx
app.post(BASE_API_URL+"/ppa/:country/:year",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});

	

// DELETE
app.delete(BASE_API_URL+"/ppa", (req,res) =>{
	db1.remove({}, { multi: true }, function (err, numRemoved) {
	if (numRemoved!=0) {
        res.sendStatus(200, "DELETED DATA BASE");
    }else{
        res.sendStatus(404, "NOT FOUND");
        }
});
	});
// DELETE yyyy/XXX
app.delete(BASE_API_URL+"/ppa/:country", (req,res)=>{
	
	var country1 = req.params.country;
	
	db1.remove({country:country1}, { multi: true }, function (err, numRemoved) {
		
	if(numRemoved!=0){
		 res.sendStatus(200, "DELETED DATA BASE");
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
		 res.sendStatus(200, "DELETED DATA BASE");
	}else{
		res.sendStatus(404,"COUNTRY AND YEAR NOT FOUND");
	}
	});
	
	
});

	
	
//PUT yyyy
app.put(BASE_API_URL+"/ppa", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
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
	

	
