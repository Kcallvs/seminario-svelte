<script>
	import { enhance } from "$app/forms";
	import {
		PRIORIDADES,
		PESO,
		prioridadeDe,
		nomePrioridade,
		formatarPrazo,
		situacaoPrazo
	} from "$lib/tarefas.js";

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let filtro = $state("todas");
	let prioridadeFiltro = $state("todas");
	let ordem = $state("criacao");
	let busca = $state("");

	let total = $derived(data.tarefas.length);
	let concluidas = $derived(data.tarefas.filter((t) => t.concluida).length);
	let pendentes = $derived(total - concluidas);
	let atrasadas = $derived(data.tarefas.filter((t) => situacaoPrazo(t) === "atrasada").length);
	let progresso = $derived(total ? Math.round((concluidas / total) * 100) : 0);

	let filtros = $derived([
		{ id: "todas", nome: "Todas", qtd: total },
		{ id: "pendentes", nome: "Pendentes", qtd: pendentes },
		{ id: "concluidas", nome: "Concluídas", qtd: concluidas }
	]);

	let visiveis = $derived.by(() => {
		const termo = busca.trim().toLowerCase();

		const lista = data.tarefas.filter((t) => {
			const porStatus =
				filtro === "todas" || (filtro === "pendentes" ? !t.concluida : t.concluida);
			const porPrioridade =
				prioridadeFiltro === "todas" || prioridadeDe(t) === prioridadeFiltro;
			const porBusca = t.titulo.toLowerCase().includes(termo);
			return porStatus && porPrioridade && porBusca;
		});

		if (ordem === "prazo") {
			// quem não tem prazo vai para o fim
			lista.sort((a, b) =>
				(a.prazo || "9999-12-31").localeCompare(b.prazo || "9999-12-31")
			);
		} else if (ordem === "prioridade") {
			lista.sort((a, b) => PESO[prioridadeDe(b)] - PESO[prioridadeDe(a)]);
		}

		return lista;
	});

	/** @param {SubmitEvent} e */
	function confirmar(e) {
		if (!confirm("Deseja realmente deletar esta tarefa?")) {
			e.preventDefault();
		}
	}
</script>

<main>
	<header class="topo">
		<div>
			<h1>Minhas tarefas</h1>
			<p class="subtitulo">Acompanhe o que está pendente e o que já foi concluído.</p>
		</div>

		<div class="acoes">
			<a href="/painel/nova" class="botao">+ Nova tarefa</a>
			<form method="POST" action="/painel?/sair">
				<button type="submit" class="botao secundario">Sair</button>
			</form>
		</div>
	</header>

	<section class="cards">
		<div class="card destaque">
			<span class="card-titulo">Total de tarefas</span>
			<strong class="card-valor">{total}</strong>
		</div>

		<div class="card">
			<span class="card-titulo"><i class="ponto pendente"></i>Pendentes</span>
			<strong class="card-valor">{pendentes}</strong>
		</div>

		<div class="card">
			<span class="card-titulo"><i class="ponto feito"></i>Concluídas</span>
			<strong class="card-valor">{concluidas}</strong>
		</div>

		<div class="card">
			<span class="card-titulo"><i class="ponto atraso"></i>Atrasadas</span>
			<strong class="card-valor" class:alerta={atrasadas > 0}>{atrasadas}</strong>
		</div>

		<div class="card">
			<span class="card-titulo">Progresso</span>
			<strong class="card-valor">{progresso}%</strong>
			<div
				class="barra"
				role="progressbar"
				aria-valuenow={progresso}
				aria-valuemin="0"
				aria-valuemax="100"
			>
				<div class="barra-preenchida" style="width: {progresso}%"></div>
			</div>
		</div>
	</section>

	<section class="tabela-caixa">
		<div class="tabela-topo">
			<div class="titulo-grupo">
				<h2>Tarefas</h2>
				<span class="contador">
					{visiveis.length}
					{visiveis.length === 1 ? "registro" : "registros"}
				</span>
			</div>

			<div class="ferramentas">
				<input
					type="search"
					class="campo-ferramenta busca"
					placeholder="Buscar tarefa..."
					bind:value={busca}
					aria-label="Buscar tarefa"
				/>

				<select
					class="campo-ferramenta"
					bind:value={prioridadeFiltro}
					aria-label="Filtrar por prioridade"
				>
					<option value="todas">Todas as prioridades</option>
					{#each PRIORIDADES as p (p.id)}
						<option value={p.id}>Prioridade {p.nome.toLowerCase()}</option>
					{/each}
				</select>

				<select class="campo-ferramenta" bind:value={ordem} aria-label="Ordenar tarefas">
					<option value="criacao">Ordem de criação</option>
					<option value="prazo">Prazo mais próximo</option>
					<option value="prioridade">Maior prioridade</option>
				</select>
			</div>
		</div>

		<div class="filtros" role="tablist">
			{#each filtros as f (f.id)}
				<button
					type="button"
					role="tab"
					aria-selected={filtro === f.id}
					class="filtro"
					class:ativo={filtro === f.id}
					onclick={() => (filtro = f.id)}
				>
					{f.nome}
					<span class="qtd">{f.qtd}</span>
				</button>
			{/each}
		</div>

		<table>
			<thead>
				<tr>
					<th>Tarefa</th>
					<th>Status</th>
					<th class="col-acoes">Ações</th>
				</tr>
			</thead>
			<tbody>
				{#each visiveis as t (t.id)}
					<tr>
						<td class="col-titulo">
							<div class="titulo-linha">
								<form method="POST" action="/painel?/alternar" use:enhance>
									<input type="hidden" name="id" value={t.id} />
									<button
										type="submit"
										class="check"
										class:marcado={t.concluida}
										title={t.concluida ? "Marcar como pendente" : "Marcar como concluída"}
										aria-label={t.concluida
											? "Marcar como pendente"
											: "Marcar como concluída"}
									>
										{#if t.concluida}✓{/if}
									</button>
								</form>

								<div class="titulo-bloco">
									<a href="/painel/{t.id}" class="link-tarefa" class:riscado={t.concluida}>
										{t.titulo}
									</a>

									<div class="meta">
										<span class="prio {prioridadeDe(t)}">
											{nomePrioridade(prioridadeDe(t))}
										</span>

										{#if t.prazo}
											{@const sit = situacaoPrazo(t)}
											<span
												class="prazo"
												class:atrasada={sit === "atrasada"}
												class:hoje={sit === "hoje"}
											>
												{#if sit === "atrasada"}Atrasada ·
												{:else if sit === "hoje"}Vence hoje ·
												{:else}Prazo:
												{/if}
												{formatarPrazo(t.prazo)}
											</span>
										{/if}
									</div>
								</div>
							</div>
						</td>
						<td>
							<span class="selo" class:feito={t.concluida}>
								<i class="ponto-selo"></i>
								{t.concluida ? "Concluída" : "Pendente"}
							</span>
						</td>
						<td class="col-acoes">
							<div class="celula-acoes">
								<a href="/painel/nova?editar={t.id}" class="botao secundario pequeno">Editar</a>
								<form method="POST" action="/painel?/deletar" onsubmit={confirmar}>
									<input type="hidden" name="id" value={t.id} />
									<button type="submit" class="botao perigo pequeno">Deletar</button>
								</form>
							</div>
						</td>
					</tr>
				{:else}
					<tr class="linha-vazia">
						<td colspan="3" class="vazio">
							{#if total === 0}
								<strong>Nenhuma tarefa ainda</strong>
								<span>Clique em "Nova tarefa" para criar a primeira.</span>
							{:else}
								<strong>Nada encontrado</strong>
								<span>Tente outro filtro ou outro termo de busca.</span>
							{/if}
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
		display: inline-block;
		background: var(--accent);
		color: var(--accent-contrast);
		border: none;
		border-radius: 8px;
		padding: 0.6rem 1.2rem;
		font-family: inherit;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		transition:
			filter 0.15s,
			transform 0.15s;
	}

	.botao:hover {
		filter: brightness(1.1);
		transform: translateY(-1px);
	}

	.botao.secundario {
		background: var(--btn-secondary);
		color: var(--accent-contrast);
	}

	.botao.perigo {
		background: var(--err);
		color: #fff;
	}

	.botao.pequeno {
		padding: 0.35rem 0.8rem;
		font-size: 0.85rem;
	}

	/* ---------- Cards de resumo ---------- */
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		gap: 1rem;
		margin: 0 0 1.5rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 1.2rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		box-shadow: var(--shadow);
	}

	.card.destaque {
		background: var(--accent);
		border-color: transparent;
		color: var(--accent-contrast);
	}

	.card-titulo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		opacity: 0.85;
	}

	.card-valor {
		font-size: 2rem;
		line-height: 1.1;
	}

	.card-valor.alerta {
		color: var(--err);
	}

	.ponto {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: var(--selo-text);
	}

	.ponto.feito {
		background: var(--selo-feito-text);
	}

	.ponto.atraso {
		background: var(--err);
	}

	.barra {
		height: 8px;
		margin-top: 0.4rem;
		background: var(--border);
		border-radius: 999px;
		overflow: hidden;
	}

	.barra-preenchida {
		height: 100%;
		background: var(--accent);
		border-radius: 999px;
		transition: width 0.4s ease;
	}

	/* ---------- Caixa da tabela ---------- */
	.tabela-caixa {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		box-shadow: var(--shadow);
		overflow: hidden;
	}

	.tabela-topo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.8rem;
		padding: 1rem 1.2rem;
	}

	.titulo-grupo {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
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

	.ferramentas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.campo-ferramenta {
		box-sizing: border-box;
		padding: 0.5rem 0.8rem;
		background: var(--surface-alt);
		color: var(--text-color);
		border: 1px solid var(--border);
		border-radius: 8px;
		font: inherit;
		font-size: 0.9rem;
	}

	.busca {
		width: 200px;
	}

	.campo-ferramenta::placeholder {
		color: var(--text-muted);
	}

	.campo-ferramenta:focus {
		outline: 2px solid var(--accent);
		outline-offset: 0;
	}

	/* ---------- Filtros ---------- */
	.filtros {
		display: flex;
		gap: 0.25rem;
		padding: 0 1.2rem;
		border-bottom: 1px solid var(--border);
		overflow-x: auto;
	}

	.filtro {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 0.9rem;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		font: inherit;
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--text-muted);
		cursor: pointer;
		white-space: nowrap;
	}

	.filtro:hover {
		color: var(--text-color);
	}

	.filtro.ativo {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	.qtd {
		padding: 0.05rem 0.5rem;
		background: var(--surface-alt);
		border-radius: 999px;
		font-size: 0.78rem;
	}

	/* ---------- Tabela ---------- */
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
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		background: var(--surface-alt);
	}

	.col-titulo {
		width: 100%;
	}

	.col-acoes {
		text-align: right;
		width: 1%;
		white-space: nowrap;
	}

	.celula-acoes {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
		align-items: center;
	}

	tbody tr {
		border-top: 1px solid var(--border);
		transition: background 0.12s;
	}

	tbody tr:hover {
		background: var(--surface-hover);
	}

	.titulo-linha {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.titulo-bloco {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		min-width: 0;
	}

	.link-tarefa {
		color: var(--text-color);
		text-decoration: none;
		font-weight: 500;
		overflow-wrap: anywhere;
	}

	.link-tarefa:hover {
		color: var(--accent);
	}

	.link-tarefa.riscado {
		color: var(--text-muted);
		text-decoration: line-through;
	}

	/* ---------- Prioridade e prazo ---------- */
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
	}

	.prio {
		--cor: #d99a00;
		padding: 0.08rem 0.55rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 700;
		color: color-mix(in srgb, var(--cor) 70%, var(--text-bold));
		background: color-mix(in srgb, var(--cor) 16%, var(--surface));
	}

	.prio.alta {
		--cor: var(--err);
	}

	.prio.media {
		--cor: #d99a00;
	}

	.prio.baixa {
		--cor: #1f9d55;
	}

	.prazo {
		color: var(--text-muted);
	}

	.prazo.atrasada {
		color: var(--err);
		font-weight: 700;
	}

	.prazo.hoje {
		color: color-mix(in srgb, #d99a00 75%, var(--text-bold));
		font-weight: 700;
	}

	/* ---------- Botão de concluir ---------- */
	.check {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		background: transparent;
		border: 2px solid var(--text-muted);
		border-radius: 50%;
		font-size: 0.85rem;
		font-weight: 700;
		line-height: 1;
		color: #fff;
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s,
			transform 0.15s;
	}

	.check:hover {
		border-color: var(--selo-feito-text);
		transform: scale(1.1);
	}

	.check.marcado {
		background: var(--selo-feito-text);
		border-color: var(--selo-feito-text);
	}

	/* ---------- Estado vazio ---------- */
	.linha-vazia:hover {
		background: none;
	}

	.vazio {
		text-align: center;
		color: var(--text-muted);
		padding: 2.5rem 1rem;
	}

	.vazio strong {
		display: block;
		margin-bottom: 0.3rem;
		font-size: 1.05rem;
		color: var(--text-bold);
	}

	/* ---------- Selos de status ---------- */
	.selo {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: var(--selo-bg);
		color: var(--selo-text);
		border-radius: 999px;
		padding: 0.2rem 0.75rem;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.selo.feito {
		background: var(--selo-feito-bg);
		color: var(--selo-feito-text);
	}

	.ponto-selo {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: currentColor;
	}

	/* ---------- Rodapé ---------- */
	.voltar {
		display: inline-block;
		margin-top: 1.5rem;
		color: var(--accent);
		text-decoration: none;
	}

	.voltar:hover {
		text-decoration: underline;
	}

	/* ---------- Celular: cada linha vira um cartão ---------- */
	@media (max-width: 640px) {
		thead {
			display: none;
		}

		table,
		tbody,
		tr,
		td {
			display: block;
			width: 100%;
			box-sizing: border-box;
		}

		tbody tr {
			padding: 0.8rem 0;
		}

		td {
			padding: 0.3rem 1.2rem;
		}

		.col-acoes {
			text-align: left;
			width: 100%;
		}

		.celula-acoes {
			justify-content: flex-start;
			margin-top: 0.4rem;
		}

		.ferramentas {
			width: 100%;
		}

		.campo-ferramenta,
		.busca {
			flex: 1 1 100%;
			width: 100%;
		}
	}
</style>