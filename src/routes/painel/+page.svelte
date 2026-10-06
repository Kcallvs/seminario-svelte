<script>
	import NavBar from "$lib/componets/Nav_bar.svelte";

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let total = $derived(data.tarefas.length);
	let concluidas = $derived(data.tarefas.filter((t) => t.concluida).length);
	let pendentes = $derived(total - concluidas);
</script>

<NavBar/>

<main>
	<header class="topo">
		<div>
			<h1>Minhas tarefas</h1>
			<p class="subtitulo">Acompanhe o que está pendente e o que já foi concluído.</p>
		</div>

		<div class="acoes">
			<a href="/painel/nova" class="botao">Nova tarefa</a>
			<form method="POST" action="/painel?/sair">
				<button type="submit" class="sair">Sair</button>
			</form>
		</div>
	</header>

	<p class="aviso">
		Você só chegou aqui porque o <code>hooks.server.js</code> encontrou o
		cookie de sessão. Sem login, o middleware teria te redirecionado
		direto para <code>/login</code>.
	</p>

	<section class="cards">
		<div class="card destaque">
			<span class="card-titulo">Total de tarefas</span>
			<strong class="card-valor">{total}</strong>
		</div>

		<div class="card">
			<span class="card-titulo">Pendentes</span>
			<strong class="card-valor">{pendentes}</strong>
		</div>

		<div class="card">
			<span class="card-titulo">Concluídas</span>
			<strong class="card-valor">{concluidas}</strong>
		</div>
	</section>

	<section class="tabela-caixa">
		<div class="tabela-topo">
			<h2>Tarefas</h2>
			<span class="contador">{total} {total === 1 ? "registro" : "registros"}</span>
		</div>

		<table>
			<thead>
				<tr>
					<th>Tarefa</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each data.tarefas as t (t.id)}
					<tr>
						<td><a href="/painel/{t.id}" class="link-tarefa">{t.titulo}</a></td>
						<td>
							<span class="selo" class:feito={t.concluida}>
								{t.concluida ? "Concluída" : "Pendente"}
							</span>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="2" class="vazio">
							Nenhuma tarefa ainda. Clique em "Nova tarefa" para criar a primeira.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<a href="/" class="voltar">← Voltar</a>
</main>

<style>
	main {
		max-width: 1000px;
		margin: 2rem auto;
		font-family: system-ui, sans-serif;
		padding: 0 1rem;
		color: #222;
	}

	.topo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	h1 {
		margin: 0;
		font-size: 1.8rem;
	}

	.subtitulo {
		margin: 0.3rem 0 0;
		color: #6b6b6b;
	}

	.acoes {
		display: flex;
		gap: 0.6rem;
		align-items: center;
	}

	.aviso {
		background: #fff4e5;
		border-left: 4px solid #ff3e00;
		padding: 0.7rem 1rem;
		font-size: 0.9rem;
		border-radius: 0 6px 6px 0;
	}

	button,
	.botao {
		background: #ff3e00;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		cursor: pointer;
		text-decoration: none;
	}

	button.sair {
		background: #444;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.card {
		background: #fff;
		border-radius: 10px;
		padding: 1.2rem;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.card.destaque {
		background: #ff3e00;
		color: #fff;
	}

	.card-titulo {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.card-valor {
		font-size: 2rem;
	}

	.tabela-caixa {
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.tabela-topo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.2rem;
		border-bottom: 1px solid #eee;
	}

	.tabela-topo h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.contador {
		color: #6b6b6b;
		font-size: 0.9rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		text-align: left;
		padding: 0.8rem 1.2rem;
	}

	th {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #6b6b6b;
		background: #fafafa;
	}

	tbody tr {
		border-top: 1px solid #eee;
	}

	tbody tr:hover {
		background: #fff8f5;
	}

	.link-tarefa {
		color: #222;
		text-decoration: none;
		font-weight: 500;
	}

	.link-tarefa:hover {
		color: #ff3e00;
	}

	.selo {
		display: inline-block;
		background: #fff4e5;
		color: #c2410c;
		border-radius: 999px;
		padding: 0.2rem 0.7rem;
		font-size: 0.85rem;
	}

	.selo.feito {
		background: #e6f4ea;
		color: #1e7e34;
	}

	.vazio {
		text-align: center;
		color: #6b6b6b;
		padding: 2rem 1rem;
	}

	.voltar {
		display: inline-block;
		margin-top: 1.5rem;
		color: #ff3e00;
		text-decoration: none;
	}
</style>