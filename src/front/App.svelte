<script>
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';

	import ppa from './ppaAPI/App.svelte';
	import gce from './gceAPI/App.svelte';

	import EditPPA from './ppaAPI/EditPpa.svelte';
	import EditGCE from './gceAPI/EditGce.svelte';

	import NotFound from './NotFound.svelte';
	
	const routes = {
		"/": Home,
		"/ppas/:country/:year": EditPPA,
		"/gce/:country/:year":EditGCE,
		"/gceAPI":gce,
		"/ppaAPI":ppa, 
		"*": NotFound
	};
</script>

<main>
	<Router {routes} />
</main>