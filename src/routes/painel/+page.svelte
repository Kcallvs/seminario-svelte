<script>
	

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let total = $derived(data.tarefas.length);
	let concluidas = $derived(data.tarefas.filter((t) => t.concluida).length);
	let pendentes = $derived(total - concluidas);
</script>

<main>
	<header class="topo">
		<div>
			<h1>Minhas tarefas</h1>
			<p class="subtitulo">Acompanhe o que está pendente e o que já foi concluído.</p>
		</div>

		<div class="acoes">
			<a href="/painel/nova" class="botao">Nova tarefa</a>
			<form method="POST" action="/painel?/sair">
				<button type="submit" class="botao secundario">Sair</button>
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
		padding: 0 1rem;
		font-family: system-ui, sans-serif;
		color: var(--text-color);
	}

	/* ---------- Cabeçalho ---------- */
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
		color: var(--text-bold);
	}

	.subtitulo {
		margin: 0.3rem 0 0;
		color: var(--subtitulo);
	}

	.acoes {
		display: flex;
		gap: 0.6rem;
		align-items: center;
	}

	/* ---------- Botões ---------- */
	.botao {
		background: var(--accent);
		color: var(--accent-contrast);
		border: none;
		border-radius: 6px;
		padding: 0.6rem 1.2rem;
		font-family: inherit;
		font-size: 1rem;
		cursor: pointer;
		text-decoration: none;
		transition: filter 0.15s;
	}

	.botao:hover {
		filter: brightness(1.1);
	}

	.botao.secundario {
		background: var(--btn-secondary);
		color: var(--accent-contrast);
	}

	/* ---------- Aviso ---------- */
	.aviso {
		background: var(--aviso-bg);
		border-left: 4px solid var(--accent);
		padding: 0.7rem 1rem;
		font-size: 0.9rem;
		border-radius: 0 6px 6px 0;
	}

	.aviso code {
		background: var(--border);
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
	}

	/* ---------- Cards de resumo ---------- */
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 1.2rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 10px;
		box-shadow: var(--shadow);
	}

	.card.destaque {
		background: var(--accent);
		border-color: transparent;
		color: var(--accent-contrast);
	}

	.card-titulo {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.card-valor {
		font-size: 2rem;
	}

	/* ---------- Tabela ---------- */
	.tabela-caixa {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 10px;
		box-shadow: var(--shadow);
		overflow: hidden;
	}

	.tabela-topo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.2rem;
		border-bottom: 1px solid var(--border);
	}

	.tabela-topo h2 {
		margin: 0;
		font-size: 1.1rem;
		color: var(--text-bold);
	}

	.contador {
		color: var(--text-muted);
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
		color: var(--text-muted);
		background: var(--surface-alt);
	}

	tbody tr {
		border-top: 1px solid var(--border);
	}

	tbody tr:hover {
		background: var(--surface-hover);
	}

	.link-tarefa {
		color: var(--text-color);
		text-decoration: none;
		font-weight: 500;
	}

	.link-tarefa:hover {
		color: var(--accent);
	}

	.vazio {
		text-align: center;
		color: var(--text-muted);
		padding: 2rem 1rem;
	}

	/* ---------- Selos de status ---------- */
	.selo {
		display: inline-block;
		background: var(--selo-bg);
		color: var(--selo-text);
		border-radius: 999px;
		padding: 0.2rem 0.7rem;
		font-size: 0.85rem;
	}

	.selo.feito {
		background: var(--selo-feito-bg);
		color: var(--selo-feito-text);
	}

	/* ---------- Rodapé ---------- */
	.voltar {
		display: inline-block;
		margin-top: 1.5rem;
		color: var(--accent);
		text-decoration: none;
	}
</style>