<script>
	import NavBar from "$lib/componets/Nav_bar.svelte";
	let { data } = $props();
	let cabecalho = $state("");

	async function verificar() {
		const res = await fetch("/sobre");
		cabecalho = res.headers.get("strict-transport-security") ?? "(não encontrado)";
	}
</script>

<NavBar/>

<main>
	<h1>Sobre HTTPS e middleware</h1>
	<p>{data.explicacao}</p>

	<button onclick={verificar}>Verificar cabeçalho da resposta</button>

	{#if cabecalho}
		<pre>Strict-Transport-Security: {cabecalho}</pre>
	{/if}

	<p class="nota">
		Em desenvolvimento (<code>npm run dev</code>) o site roda em HTTP, então
		o cabeçalho aparece mas o navegador o ignora. Rodando com
		<code>node server.js</code> (HTTPS real, ver README), ele passa a valer.
	</p>

	<a href="/">← Voltar</a>
</main>

<style>
	main {
		max-width: 640px;
		margin: 2rem auto;
		font-family: system-ui, sans-serif;
		padding: 0 1rem;
	}
	button {
		background: #ff3e00;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		cursor: pointer;
		margin: 1rem 0;
	}
	pre {
		background: #1a1a1e;
		color: #40b3a2;
		padding: 0.8rem 1rem;
		border-radius: 6px;
		overflow-x: auto;
	}
	.nota {
		font-size: 0.85rem;
		color: #666;
	}
</style>
