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

	let ppas = [];
	let newPPA = {
		country: "",
		year: ("") ,
		aas_gross: "",
		aas_net:"",
		ppa_per_capita:""
	};
	let countries = [];
	let years = [];
	let currentCountry = "-";
	let currentYear = "-";

	let numberElementsPages = 10;
	let offset = 0;
	let currentPage = 1; 
	let moreData = true; 

	onMount(getPpa);
	onMount(getCountryYears);



	async function ReloadTable() {
		const res = await fetch("/api/v1/ppas/loadInitialData")

		if (res.ok) {
			const initialPPA = await res.json();
			console.log("Contados "+ initialPPA.length +" datos de PPA")
			getPpa();
			responseAlert("Se ha reiniciado la tabla correctamente con los valores iniciales")
		}else{
			console.log("No se han cargado correctamente los datos iniciales")
			errorResponse(res)
		}
	}


	async function getCountryYears() {
		const res = await fetch("/api/v1/ppas"); 

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

	


	async function getPpa(){

		console.log("Fetching ppas...");
		const res = await fetch("/api/v1/ppas?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages); 

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			ppas = json;
			console.log("Received " + ppas.length + " ppas.");

			if (ppas.length!=10){
				moreData=false
			} else{

						const next = await fetch("/api/v1/ppas?offset=" + numberElementsPages * (offset+1) + "&limit=" + numberElementsPages); 
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

	async function insertPpa() {

		console.log("Inserting ppas..." + JSON.stringify(newPPA));

		if (newPPA.country == ""
			|| newPPA.country == null
			|| newPPA.year == "" 
			|| newPPA.year == null) {
			
			alert("Se debe incluir el nombre del país y el año obligatoriamente");

		} else {
				const res = await fetch("/api/v1/ppas", {
					method: "POST",
					body: JSON.stringify(newPPA),
					headers: {
						"Content-Type": "application/json"
					}
				}).then(function (res) {
					if (res.ok){
						getPpa();
						responseAlert("Datos de " +newPPA.country + " añadidos correctamente")
					} else{
						errorResponse(res)
					}
					
				});
			}
	}


	//Borramos un pais en un año concreto
	async function deletePPA(country,year) {
		console.log("Deleting marrriage..." + JSON.stringify(country)+ + JSON.stringify(year) );

		const res = await fetch("/api/v1/ppas/" + country+"/"+year, {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok){
				getPpa();
				getCountryYears();
				responseAlert("El dato se ha borrado correctamente")
			} 
			else {
				errorResponse(res);
			}
		});
	}

	async function deletePPAcountries() {
		console.log("Deleting all ppas data...");
		const res = await fetch("/api/v1/ppas/", {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok){
			const json =  res.json();
			ppas = json;
			responseAlert("Todos los datos se han borrado correctamente")
		} else{
			errorResponse(res);
		}
		});
	}


	async function search(country, year) {
		console.log("Searching data: " + country + " and " + year);
		var url = "/api/v1/ppas";

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
			ppas = json;			
			console.log("Found " + ppas.length + " ppas stats.");
		
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
		getPpa();
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
	{#await ppas}
		Loading ppas...
	{:then ppas}
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
                    <th>Salario Bruto</th>
                    <th>Salario neto</th>
                    <th>Paridad de poder Adquisitivo</th>
                    <th>Acciones</th>

				</tr>
			</thead>
			<tbody>
				<tr>
					<td><input  placeholder="Ej. Spain" bind:value="{newPPA.country}"></td>
					<td><input type="number" placeholder="Ej. 2000" bind:value="{newPPA.year}" ></td>
					<td><input type="number" placeholder="Ej. 1111111" bind:value="{newPPA.aas_gross}"></td>
					<td><input type="number" placeholder="Ej. 1111111" bind:value="{newPPA.aas_net}"></td>
					<td><input type="number" placeholder="Ej. 1111111" bind:value="{newPPA.ppa_per_capita}"></td>
					<td> <Button outline  color="primary" on:click={insertPpa} > Insertar</Button> </td>
				</tr>
				{#each ppas as ppa}
					<tr>
						<td>
							<a href="#/ppas/{ppa.country}/{ppa.year}">{ppa.country}</a>
						</td>
						<td>{ppa.year}</td>
						<td>{ppa.aas_gross}</td>
						<td>{ppa.aas_net}</td>
						<td>{ppa.ppa_per_capita}</td>
						<td><Button outline color="danger" on:click="{deletePPA(ppa.country,ppa.year)}">  <i class="fa fa-trash" aria-hidden="true"></i> Borrar</Button></td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
 
	<Pagination style="float:right;" ariaLabel="Cambiar de página">


		<PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
		  <PaginationLink previous href="#/ppaAPI" on:click="{() => addOffset(-1)}" />
		</PaginationItem>
		
		{#if currentPage != 1}
		<PaginationItem>
			<PaginationLink href="#/ppaAPI" on:click="{() => addOffset(-1)}" >{currentPage - 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem active>
			<PaginationLink href="#/ppaAPI" >{currentPage}</PaginationLink>
		</PaginationItem>
		{#if moreData}
		<PaginationItem >
			<PaginationLink href="#/ppaAPI" on:click="{() => addOffset(1)}">{currentPage + 1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem class="{moreData ? '' : 'disabled'}">
		  <PaginationLink next href="#/ppaAPI" on:click="{() => addOffset(1)}"/>
		</PaginationItem>

	</Pagination>

	<Button outline  color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
	<Button outline  on:click={deletePPAcountries}   color="danger"> <i class="fa fa-trash" aria-hidden="true"></i> Borrar todo </Button>
	


</main>