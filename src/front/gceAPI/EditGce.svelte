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


    export let params = {};
    let gce = {};
    let updatedCountry = "XXXX";
    let updatedYear = 11111;
    let updatedGce_country =11111;
    let updatedGce_per_capita =11111;
    let updatedGce_cars =11111;
    let errorMsg = "";

    onMount(getGCE);

    async function getGCE() {

        console.log("Fetching gce...");
        const res = await fetch("/api/v1/gce/" + params.country +"/"+params.year);
        
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            gce = json;
            updatedCountry = gce.country;
            updatedYear = gce.year;
            updatedGce_country = gce.gce_country;
            updatedGce_per_capita=gce.gce_per_capita;
            updatedGce_cars=gce.gce_cars;
            console.log("Received gce.");
        } else {
            errorMsg = res.status + ": " + res.statusText;
            console.log("ERROR!" + errorMsg);
        }
    }


    async function updateGCE() {

        console.log("Updating gce..." + JSON.stringify(params.country));

        const res = await fetch("/api/v1/gce/" + params.country +"/"+params.year, {
            method: "PUT",
            body: JSON.stringify({
                country: params.country,
                year: params.year,
                gce_country: updatedGce_country,
                gce_per_capita: updatedGce_per_capita,
                gce_cars: updatedGce_cars
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getGCE();
            if (res.ok) {
                 responseAlert("Los datos de " +params.country+ " en el año " +params.year+ " han sido actualizados correctamente")
            } else if (res.status == 404) {
                    errorAlert("Se ha intentado borrar un elemento inexistente.");
                } 
                
        });
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

    
function errorResponse(res) {
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
    <h3>Editar GCE <strong>{gce.country} {gce.year}</strong></h3>
    {#await gce}
        Loading gce...
    {:then gce}
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
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input type="number" bind:value="{updatedGce_country}"></td>
                    <td><input type="number" bind:value="{updatedGce_per_capita}"></td>
                    <td><input type="number" bind:value="{updatedGce_cars}"></td>
                    <td> <Button outline  color="primary" on:click={updateGCE}> <i class="fas fa-pencil-alt"> <i class="fas fa-pencil-alt"> </i> Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}
    {#if errorMsg}
        <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Atras</Button>
</main>