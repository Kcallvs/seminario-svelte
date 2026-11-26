<script>
	import { invalidateAll } from "$app/navigation";
	import ModalTarefa from "$lib/componets/ModalTarefa.svelte";

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

	let prioridadeFiltro = $state("todas");
	let ordem = $state("criacao");
	let busca = $state("");

	/** @type {number | string | null} */
	let arrastando = $state(null);
	/** @type {string | null} */
	let sobre = $state(null);

	let modalAberto = $state(false);
	/** @type {any} */
	let tarefaEditando = $state(null);

	function abrirNova() {
		tarefaEditando = null;
		modalAberto = true;
	}

	/** @param {any} t */
	function abrirEditar(t) {
		tarefaEditando = t;
		modalAberto = true;
	}

	async function alternarTarefa(id, concluida) {
		try {
			const resposta = await fetch(`/api/dados/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ concluida })
			});

			const resultado = await resposta.json().catch(() => ({}));

			if (!resposta.ok) {
				alert(resultado.erro ?? "Não foi possível atualizar a tarefa.");
				return;
			}

			await invalidateAll();
		} catch {
			alert("Não foi possível estabelecer conexão com a API.");
		}
	}

	async function excluirTarefa(id) {
		if (!confirm("Deseja realmente deletar esta tarefa?")) return;

		try {
			const resposta = await fetch(`/api/dados/${id}`, {
				method: "DELETE"
			});

			if (!resposta.ok) {
				const resultado = await resposta.json().catch(() => ({}));
				alert(resultado.erro ?? "Não foi possível excluir a tarefa.");
				return;
			}

			await invalidateAll();
		} catch {
			alert("Não foi possível estabelecer conexão com a API.");
		}
	}

	let total = $derived(data.tarefas.length);
	let concluidas = $derived(data.tarefas.filter((t) => t.concluida).length);
	let pendentes = $derived(total - concluidas);
	let atrasadas = $derived(data.tarefas.filter((t) => situacaoPrazo(t) === "atrasada").length);
	let progresso = $derived(total ? Math.round((concluidas / total) * 100) : 0);

	let visiveis = $derived.by(() => {
		const termo = busca.trim().toLowerCase();

		const lista = data.tarefas.filter((t) => {
			const porPrioridade =
				prioridadeFiltro === "todas" || prioridadeDe(t) === prioridadeFiltro;
			const porBusca = t.titulo.toLowerCase().includes(termo);
			return porPrioridade && porBusca;
		});

		if (ordem === "prazo") {
			lista.sort((a, b) =>
				(a.prazo || "9999-12-31").localeCompare(b.prazo || "9999-12-31")
			);
		} else if (ordem === "prioridade") {
			lista.sort((a, b) => PESO[prioridadeDe(b)] - PESO[prioridadeDe(a)]);
		}

		return lista;
	});

	let colunas = $derived([
		{ id: "pendentes", nome: "Pendentes", feita: false, itens: visiveis.filter((t) => !t.concluida) },
		{ id: "concluidas", nome: "Concluídas", feita: true, itens: visiveis.filter((t) => t.concluida) }
	]);

	/**
	 * @param {DragEvent} e
	 * @param {number | string} id
	 */
	function iniciarArrasto(e, id) {
		arrastando = id;

		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData("text/plain", String(id));
		}
	}

	function fimArrasto() {
		arrastando = null;
		sobre = null;
	}

	/**
	 * @param {DragEvent} e
	 * @param {boolean} feita
	 */
	async function soltar(e, feita) {
		e.preventDefault();

		const t = data.tarefas.find((x) => String(x.id) === String(arrastando));

		fimArrasto();

		if (!t || Boolean(t.concluida) === feita) return;

		await alternarTarefa(t.id, feita);
	}
</script>

<main>
	<header class="topo">
		<div>
			<h1>Minhas tarefas</h1>
			<p class="subtitulo">Arraste os cartões entre as listas para mudar o status.</p>
		</div>

		<div class="acoes">
			<a
				href="/painel/nova"
				class="botao"
				onclick={(e) => {
					e.preventDefault();
					abrirNova();
				}}>+ Nova tarefa</a>
			<form method="POST" action="/painel?/sair">
				<button type="submit" class="botao secundario">Sair</button>
			</form>
		</div>
	</header>

	<section class="resumo">
		<span class="chip">{total} no total</span>
		<span class="chip"><i class="ponto pendente"></i>{pendentes} pendentes</span>
		<span class="chip"><i class="ponto feito"></i>{concluidas} concluídas</span>
		<span class="chip" class:alerta={atrasadas > 0}><i class="ponto atraso"></i>{atrasadas} atrasadas</span>

		<div class="progresso">
			<div
				class="barra"
				role="progressbar"
				aria-valuenow={progresso}
				aria-valuemin="0"
				aria-valuemax="100"
			>
				<div class="barra-preenchida" style="width: {progresso}%"></div>
			</div>
			<span>{progresso}%</span>
		</div>
	</section>

	<section class="ferramentas">
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
	</section>

	<section class="quadro">
		{#each colunas as col (col.id)}
			<div
				class="lista"
				class:alvo={sobre === col.id && arrastando !== null}
				role="region"
				aria-label="Lista {col.nome}"
				ondragover={(e) => {
					e.preventDefault();
					sobre = col.id;
				}}
				ondragleave={(e) => {
					if (!e.currentTarget.contains(/** @type {Node} */ (e.relatedTarget))) sobre = null;
				}}
				ondrop={(e) => soltar(e, col.feita)}
			>
				<header class="lista-topo">
					<h2>{col.nome}</h2>
					<span class="contador">{col.itens.length}</span>
				</header>

				<div class="cartoes">
					{#each col.itens as t (t.id)}
						{@const sit = situacaoPrazo(t)}
						<article
							class="cartao"
							class:arrastado={String(arrastando) === String(t.id)}
							draggable="true"
							ondragstart={(e) => iniciarArrasto(e, t.id)}
							ondragend={fimArrasto}
						>
							{#if t.imagem}
								<img src={t.imagem} alt="" class="capa" draggable="false" />
							{/if}

							<div class="etiquetas">
								<span class="etiqueta {prioridadeDe(t)}">{nomePrioridade(prioridadeDe(t))}</span>
							</div>

							<div class="cartao-linha">
								<button
									type="button"
									class="check"
									class:marcado={t.concluida}
									title={t.concluida ? "Marcar como pendente" : "Marcar como concluída"}
									aria-label={t.concluida ? "Marcar como pendente" : "Marcar como concluída"}
									onclick={() => alternarTarefa(t.id, !t.concluida)}
								>
									{#if t.concluida}✓{/if}
								</button>

								<a
									href="/painel/{t.id}"
									draggable="false"
									class="link-tarefa"
									class:riscado={t.concluida}
								>
									{t.titulo}
								</a>
							</div>

							<div class="cartao-rodape">
								{#if t.prazo}
									<span
										class="prazo"
										class:atrasada={sit === "atrasada" && !t.concluida}
										class:hoje={sit === "hoje" && !t.concluida}
										class:feito={t.concluida}
										title={sit === "atrasada" ? "Atrasada" : sit === "hoje" ? "Vence hoje" : "Prazo"}
									>
										🕒 {formatarPrazo(t.prazo)}
									</span>
								{:else}
									<span></span>
								{/if}

								<div class="mini-acoes">
									<a
										href="/painel/nova?editar={t.id}"
										onclick={(e) => {
											e.preventDefault();
											abrirEditar(t);
										}}
										draggable="false"
										class="mini"
										title="Editar"
										aria-label="Editar"
									>
										✎
									</a>
									<button
										type="button"
										class="mini perigo"
										title="Deletar"
										aria-label="Deletar"
										onclick={() => excluirTarefa(t.id)}
									>
										🗑
									</button>
								</div>
							</div>
						</article>
					{:else}
						<p class="lista-vazia">
							{#if total === 0}
								Nenhuma tarefa ainda.
							{:else}
								Nenhum cartão aqui.
							{/if}
						</p>
					{/each}
				</div>

				{#if !col.feita}
					<a
						href="/painel/nova"
						class="adicionar"
						onclick={(e) => {
							e.preventDefault();
							abrirNova();
						}}>+ Adicionar tarefa</a>
				{/if}
			</div>
		{/each}
	</section>

	<a href="/" class="voltar">← Voltar</a>
</main>

<ModalTarefa
	aberto={modalAberto}
	tarefa={tarefaEditando}
	onfechar={() => (modalAberto = false)}
/>

<style>
	main {
		max-width: 1000px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: system-ui, sans-serif;
		color: var(--text-color);
	}

	.topo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.2rem;
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

	.resumo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.75rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.chip.alerta {
		color: var(--err);
		border-color: var(--err);
	}

	.ponto {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--selo-text);
	}

	.ponto.feito {
		background: var(--selo-feito-text);
	}

	.ponto.atraso {
		background: var(--err);
	}

	.progresso {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.barra {
		width: 140px;
		height: 8px;
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

	.ferramentas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.campo-ferramenta {
		box-sizing: border-box;
		padding: 0.5rem 0.8rem;
		background: var(--surface);
		color: var(--text-color);
		border: 1px solid var(--border);
		border-radius: 8px;
		font: inherit;
		font-size: 0.9rem;
	}

	.busca {
		width: 220px;
	}

	.campo-ferramenta::placeholder {
		color: var(--text-muted);
	}

	.campo-ferramenta:focus {
		outline: 2px solid var(--accent);
		outline-offset: 0;
	}

	.quadro {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		align-items: start;
	}

	.lista {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 0.7rem;
		background: var(--surface-alt);
		border: 1px solid var(--border);
		border-radius: 12px;
		transition:
			outline-color 0.12s,
			background 0.12s;
		outline: 2px dashed transparent;
		outline-offset: -2px;
	}

	.lista.alvo {
		outline-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 8%, var(--surface-alt));
	}

	.lista-topo {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.2rem 0.4rem 0;
	}

	.lista-topo h2 {
		margin: 0;
		font-size: 0.95rem;
		color: var(--text-bold);
	}

	.contador {
		padding: 0.05rem 0.55rem;
		background: var(--surface);
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--text-muted);
	}

	.cartoes {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		min-height: 3rem;
	}

	.lista-vazia {
		margin: 0;
		padding: 1rem 0.5rem;
		text-align: center;
		font-size: 0.88rem;
		color: var(--text-muted);
	}

	.adicionar {
		display: block;
		padding: 0.5rem 0.6rem;
		border-radius: 8px;
		color: var(--text-muted);
		font-size: 0.9rem;
		text-decoration: none;
		transition: background 0.12s;
	}

	.adicionar:hover {
		background: var(--surface-hover);
		color: var(--text-color);
	}

	.cartao {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.6rem 0.7rem 0.5rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		box-shadow: var(--shadow);
		cursor: grab;
		transition:
			transform 0.12s,
			box-shadow 0.12s,
			opacity 0.12s;
	}

	.cartao:hover {
		transform: translateY(-1px);
	}

	.cartao:active {
		cursor: grabbing;
	}

	.cartao.arrastado {
		opacity: 0.45;
		transform: rotate(2deg);
	}

	.capa {
		display: block;
		width: 100%;
		max-height: 140px;
		object-fit: cover;
		border-radius: 6px;
	}

	.etiquetas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.etiqueta {
		min-width: 2.2rem;
		padding: 0 0.5rem;
		border-radius: 4px;
		background: #d99a00;
		color: #fff;
		font-size: 0.68rem;
		font-weight: 700;
		line-height: 1.15rem;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.etiqueta.alta {
		background: var(--err);
	}

	.etiqueta.media {
		background: #d99a00;
	}

	.etiqueta.baixa {
		background: #1f9d55;
	}

	.cartao-linha {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
	}

	.link-tarefa {
		color: var(--text-color);
		text-decoration: none;
		font-weight: 500;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.link-tarefa:hover {
		color: var(--accent);
	}

	.link-tarefa.riscado {
		color: var(--text-muted);
		text-decoration: line-through;
	}

	.check {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 1.2rem;
		height: 1.2rem;
		margin-top: 0.1rem;
		padding: 0;
		background: transparent;
		border: 2px solid var(--text-muted);
		border-radius: 50%;
		font-size: 0.7rem;
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
		transform: scale(1.12);
	}

	.check.marcado {
		background: var(--selo-feito-text);
		border-color: var(--selo-feito-text);
	}

	.cartao-rodape {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		min-height: 1.6rem;
	}

	.prazo {
		padding: 0.1rem 0.45rem;
		border-radius: 4px;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.prazo.atrasada {
		background: var(--err);
		color: #fff;
		font-weight: 700;
	}

	.prazo.hoje {
		background: #d99a00;
		color: #fff;
		font-weight: 700;
	}

	.prazo.feito {
		background: #1f9d55;
		color: #fff;
	}

	.mini-acoes {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		margin-left: auto;
		opacity: 0;
		transition: opacity 0.12s;
	}

	.cartao:hover .mini-acoes,
	.cartao:focus-within .mini-acoes {
		opacity: 1;
	}

	.mini {
		display: grid;
		place-items: center;
		width: 1.7rem;
		height: 1.7rem;
		padding: 0;
		background: none;
		border: none;
		border-radius: 6px;
		font-size: 0.85rem;
		color: var(--text-muted);
		text-decoration: none;
		cursor: pointer;
	}

	.mini:hover {
		background: var(--surface-hover);
		color: var(--text-color);
	}

	.mini.perigo:hover {
		background: var(--err);
		color: #fff;
	}

	.voltar {
		display: inline-block;
		margin-top: 1.5rem;
		color: var(--accent);
		text-decoration: none;
	}

	.voltar:hover {
		text-decoration: underline;
	}

	@media (max-width: 720px) {
		.quadro {
			grid-template-columns: 1fr;
		}

		.progresso {
			margin-left: 0;
			width: 100%;
		}

		.barra {
			flex: 1;
			width: auto;
		}

		.busca,
		.campo-ferramenta {
			flex: 1 1 100%;
			width: 100%;
		}
	}

	@media (hover: none) {
		.mini-acoes {
			opacity: 1;
		}
	}
</style>