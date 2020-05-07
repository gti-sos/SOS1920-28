<script>
	import {
		onMount
	} from "svelte";

	import {
        pop
    } from "svelte-spa-router";

	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";


	import Input from "sveltestrap/src/Input.svelte";
	import Label from "sveltestrap/src/Label.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";

	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

	let gce = [];
	let newGCE = {
		country: "",
		year: ("") ,
		gce_country: "",
		gce_per_capita:"",
		gce_cars:""
	};

	let countries = [];
	let years = [];
	let currentCountry = "-";
	let currentYear = "-";

	let numberElementsPages = 10;
	let offset = 0;
	let currentPage = 1; 
	let moreData = true; 

	onMount(getGCE);
	onMount(getCountryYears);



	async function ReloadTable() {
		const res = await fetch("/api/v1/gce/loadInitialData")

		if (res.ok) {
			const initialGCE = await res.json();
			console.log("Contados "+ initialGCE.length +" datos de gce")
			getGCE();
			responseAlert("Se ha reiniciado la tabla correctamente con los valores iniciales")
		}else{
			console.log("No se han cargado correctamente los datos iniciales")
			errorResponse(res)
		}
	}


	async function getCountryYears() {
		const res = await fetch("/api/v1/gce"); 

		if (res.ok) {
			const json = await res.json();

			countries = json.map((d) => {
					return d.country;            
			});
			countries = Array.from(new Set(countries));   
			
			
			years = json.map((d) => {   
					return d.year;    
			});
			years = Array.from(new Set(years));      

			console.log("Contados " + countries.length + "paises y " + years.length + "años distintos.");

		} else {
			errorResponse(res)
		}
	}

	

	async function getGCE(){

		console.log("Fetching gce...");
		const res = await fetch("/api/v1/gce?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages); 

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			gce = json;
			console.log("Received " + gce.length + " gce.");

			if (gce.length!=10){
				moreData=false
			} else{

						const next = await fetch("/api/v1/gce?offset=" + numberElementsPages * (offset+1) + "&limit=" + numberElementsPages); 
						console.log("La variable NEXT tiene el estado: " + next.status)
						const jsonNext = await next.json();
						
						
						
						if (jsonNext.length == 0 || next.status==404) {  
							moreData = false;
						} 
						else {
							moreData = true;  
						}
					}
		} 
		else {
			errorResponse(res)
		}
	}

	async function insertGce() {

		console.log("Inserting gce..." + JSON.stringify(newGCE));

		if (newGCE.country == ""
			|| newGCE.country == null
			|| newGCE.year == "" 
			|| newGCE.year == null) {
			
			alert("Se debe incluir el nombre del país y el año obligatoriamente");

		} else {
				const res = await fetch("/api/v1/gce", {
					method: "POST",
					body: JSON.stringify(newGCE),
					headers: {
						"Content-Type": "application/json"
					}
				}).then(function (res) {
					if (res.ok){
						getGCE();
						responseAlert("Datos de " +newGCE.country + " añadidos correctamente")
					} else{
						errorResponse(res)
					}
					
				});
			}
	}


	async function deleteGCE(country,year) {
		console.log("Deleting gce..." + JSON.stringify(country)+ + JSON.stringify(year) );

		const res = await fetch("/api/v1/gce/" + country+"/"+year, {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok){
				getGCE();
				getCountryYears();
				responseAlert("El dato se ha borrado correctamente")
			} 
			else {
				errorResponse(res);
			}
		});
	}

	async function deleteGCEcountries() {
		console.log("Deleting all gce data...");
		const res = await fetch("/api/v1/gce/", {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok){
			const json =  res.json();
			gce = json;
			responseAlert("Todos los datos se han borrado correctamente")
		} else{
			errorResponse(res);
		}
		});
	}


	async function search(country, year) {
		console.log("Searching data: " + country + " and " + year);
		var url = "/api/v1/gce";

		if (country != "-" && year != "-") {
			url = url + "?country=" + country + "&year=" + year; 
		} else if (country != "-" && year == "-") {
			url = url + "?country=" + country;
		} else if (country == "-" && year != "-") {
			url = url + "?year=" + year;
		}

		const res = await fetch(url);

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			gce = json;			
			console.log("Found " + gce.length + " gce stats.");
		
			if (country != "-" && year != "-") {
				responseAlert("Busqueda de "+ country+ " en el año " + year +" realizada correctamente")  
		} else if (country != "-" && year == "-") {
				responseAlert("Busqueda de "+ country  +" realizada correctamente" )  
		} else if (country == "-" && year != "-") {
				responseAlert("Busqueda en el año "+ year+ " realizada correctamente")  
		}
		} else {
			errorResponse(res)
			console.log("ERROR!");
		}
		
	}

	function addOffset (increment) {
		offset += increment;
		currentPage += increment;
		getGCE();
	}



	function responseAlert(msg) {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-success";
		alert_element.innerHTML = "<strong>¡Exito!</strong> " + msg;
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
	}

	function clearAlert () {
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "display: none; ";
		alert_element.className = "alert alert-dismissible in";
		alert_element.innerHTML = "";
	}

function errorResponse(res, msg) {
	var status = res.status
	switch (status) {
		case 400:
			alert("Codigo de error: " + status + '\n'+ "Los datos introduccidos no son validos");
			break;
		case 401:
			alert("Codigo de error: " + status + '\n'+ "No tiene permisos para realizar esta accion");
			break;
		case 404:
			alert("Codigo de error: " + status + '\n'+ "Página no encontrada");
			break;
		case 405:
			alert("Codigo de error: " + status + '\n'+ "Metodo no permitido");
			break;
		case 409:
			alert("Codigo de error: " + status + '\n'+ "Conclifto con la operacion");
			break;

		default:
			if (status!=400 && status!=401 && status!=404 && status!=405  && status!=409  && status!=200  && status!=2001) {
				alert("Codigo de error: "+ status +'\n'+ "Error de desconocido por el sistema")
				break;

			}else{
				break;
			}
			
	}
}


</script>

<main>
	<div role="alert" id="div_alert" style="display: none;">
	</div>
	{#await gce}
		Loading gce...
	{:then gce}
	<Button outline  color="primary" on:click="{ReloadTable}"> <i class="fas fa-search"></i> Recargar datos originales </Button>
		<FormGroup> 
			<Label for="selectCountry"> Búsqueda por país </Label>
			<Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
				{#each countries as country}
				<option>{country}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>
				
		<FormGroup>
			<Label for="selectYear"> Año </Label>
			<Input type="select"  name="selectYear" id="selectYear" bind:value="{currentYear}">
				{#each years as year}
				<option>{year}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>

		<Button outline color="secondary" on:click="{search(currentCountry, currentYear)}" class="button-search" > <i class="fas fa-search"></i> Buscar </Button>
		

		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Media Países por producción</th>
					<th>Media per Capita</th>
					<th>Media de produccion de coches</th>
					<th>Acciones</th>

				</tr>
			</thead>
			<tbody>
				<tr>
					<td><input  placeholder="Ej. Spain" bind:value="{newGCE.country}"></td>
					<td><input type="number" placeholder="Ej. 2000" bind:value="{newGCE.year}" ></td>
					<td><input type="number" placeholder="Ej. 111111" bind:value="{newGCE.gce_country}"></td>
					<td><input type="number" placeholder="Ej. 11,11" bind:value="{newGCE.gce_per_capita}"></td>
					<td><input type="number" placeholder="Ej. 111111" bind:value="{newGCE.gce_cars}"></td>
					<td> <Button outline  color="primary" on:click={insertGce} > Insertar</Button> </td>
				</tr>
				{#each gce as gce}
					<tr>
						<td>
							<a href="#/gce/{gce.country}/{gce.year}">{gce.country}</a>
						</td>
						<td>{gce.year}</td>
						<td>{gce.gce_country}</td>
						<td>{gce.gce_per_capita}</td>
						<td>{gce.gce_cars}</td>
						<td><Button outline color="danger" on:click="{deleteGCE(gce.country,gce.year)}">  <i class="fa fa-trash" aria-hidden="true"></i> Borrar</Button></td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
 
	<Pagination style="float:right;" ariaLabel="Cambiar de página">


		<PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
		  <PaginationLink previous href="#/gceAPI" on:click="{() => addOffset(-1)}" />
		</PaginationItem>
		
		{#if currentPage != 1}
		<PaginationItem>
			<PaginationLink href="#/gceAPI" on:click="{() => addOffset(-1)}" >{currentPage - 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem active>
			<PaginationLink href="#/gceAPI" >{currentPage}</PaginationLink>
		</PaginationItem>

		{#if moreData}
		<PaginationItem >
			<PaginationLink href="#/gceAPI" on:click="{() => addOffset(1)}">{currentPage + 1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem class="{moreData ? '' : 'disabled'}">
		  <PaginationLink next href="#/gceAPI" on:click="{() => addOffset(1)}"/>
		</PaginationItem>

	</Pagination>

	<Button outline  color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
	<Button outline  on:click={deleteGCEcountries}   color="danger"> <i class="fa fa-trash" aria-hidden="true"></i> Borrar todo </Button>
	


</main>