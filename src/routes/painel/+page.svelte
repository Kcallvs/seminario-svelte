<script>
	let pedidos = $state([]);
	let carregando = $state(false);
	let erro = $state("");

	async function buscar() {
		carregando = true;
		erro = "";
		try {
			const res = await fetch("/api/dados");
			if (!res.ok) throw new Error("Falha ao buscar pedidos");
			pedidos = await res.json();
		} catch (e) {
			erro = e.message;
		} finally {
			carregando = false;
		}
	}
</script>

<main>
	<h1>Painel de pedidos</h1>
	<p class="aviso">
		Você só chegou aqui porque o <code>hooks.server.js</code> encontrou o
		cookie de sessão. Sem login, o middleware teria te redirecionado
		direto para <code>/login</code>.
	</p>

	<button on:click={buscar} disabled={carregando}>
		{carregando ? "Carregando..." : "Atualizar pedidos"}
	</button>

	{#if erro}
		<p class="erro">{erro}</p>
	{/if}

	<ul>
		{#each pedidos as p}
			<li>{p.cliente} — {p.status}</li>
		{:else}
			<li>Nenhum pedido carregado ainda. Clique no botão acima.</li>
		{/each}
	</ul>

	<form method="POST" action="/painel?/sair">
		<button type="submit" class="sair">Sair</button>
	</form>
	<a href="/">← Voltar</a>
</main>

<style>
	main {
		max-width: 640px;
		margin: 2rem auto;
		font-family: system-ui, sans-serif;
		padding: 0 1rem;
	}
	.aviso {
		background: #fff4e5;
		border-left: 4px solid #ff3e00;
		padding: 0.7rem 1rem;
		font-size: 0.9rem;
	}
	button {
		background: #ff3e00;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		cursor: pointer;
	}
	button.sair {
		background: #444;
		margin-top: 1rem;
	}
	button:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.erro {
		color: #b00020;
	}
	ul {
		margin-top: 1.5rem;
		padding-left: 1.2rem;
	}
</style>
