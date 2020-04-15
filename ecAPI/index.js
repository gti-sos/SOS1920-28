module.exports = function(){
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
	
app.post(BASE_API_URL+"/ec/:country",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});

// DELETE 	
app.delete(BASE_API_URL+"/ec", (req,res) =>{
	db2.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	res.send("DELETED DATA BASE");
});	
	
// DELETE yyyy/XXX	
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
app.put(BASE_API_URL+"/ec", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});	
// PUT yyyy/XXX
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
	
	
	
	
};