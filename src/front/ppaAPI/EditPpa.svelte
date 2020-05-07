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
    let ppa = {};
    let updatedCountry = "XXXX";
    let updatedYear = 11111;
    let updatedAas_gross =11111;
    let updatedAss_net =11111;
    let updatedPpa_per_capita =11111;
    let errorMsg = "";

    onMount(getPpa);

    async function getPpa() {

        console.log("Fetching ppa...");
        const res = await fetch("/api/v1/ppas/" + params.country +"/"+params.year);
        
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            ppa = json;
            updatedCountry = ppa.country;
            updatedYear = ppa.year;
            updatedAas_gross = ppa.aas_gross;
            updatedAss_net=ppa.aas_net;
            updatedPpa_per_capita=ppa.ppa_per_capita;
            console.log("Received ppa.");
        } else {
            errorMsg = res.status + ": " + res.statusText;
            console.log("ERROR!" + errorMsg);
        }
    }


    async function updatePPA() {

        console.log("Updating ppas..." + JSON.stringify(params.country));

        const res = await fetch("/api/v1/ppas/" + params.country +"/"+params.year, {
            method: "PUT",
            body: JSON.stringify({
                country: params.country,
                year: params.year,
                ass_gross: updatedAss_gross,
                ass_net:updatedAss_net,
                ppa_per_capita:updatedPpa_per_capita
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getPpa();
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
    <h3>Editar PPA <strong>{ppa.country} {ppa.year}</strong></h3>
    {#await ppa}
        Loading ppa...
    {:then ppa}
        <Table bordered>
            <thead>
                <tr>
                    <th>Pais</th>
                    <th>Año</th>
                    <th>Media Salario Bruto</th>
                    <th>Media Salario neto</th>
                    <th>Media Paridad de poder Adquisitivo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input type="number" bind:value="{updatedAas_gross}"></td>
                    <td><input type="number" bind:value="{updatedAss_net}"></td>
                    <td><input type="number" bind:value="{updatedPpa_per_capita}"></td>
                    <td> <Button outline  color="primary" on:click={updatePPA}> <i class="fas fa-pencil-alt"> <i class="fas fa-pencil-alt"> </i> Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}
    {#if errorMsg}
        <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Atras</Button>
</main>