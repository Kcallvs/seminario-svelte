<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/theme.css';

    import Navbar from '$lib/componets/Navbar.svelte';
	let { data,children } = $props();
</script>

<Navbar is_login={data.logado}/>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
