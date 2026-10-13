<script>
	import { enhance } from "$app/forms";
	import { PRIORIDADES, prioridadeDe } from "$lib/tarefas.js";

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();

	/** @type {boolean} */
	let enviando = $state(false);

	let editando = $derived(data.tarefa !== null);
	let titulo = $derived(form?.titulo ?? data.tarefa?.titulo ?? "");
	let descricao = $derived(form?.descricao ?? data.tarefa?.descricao ?? "");
	let prazo = $derived(form?.prazo ?? data.tarefa?.prazo ?? "");
	let prioridade = $derived(
		form?.prioridade ?? (data.tarefa ? prioridadeDe(data.tarefa) : "media")
	);
	let concluida = $derived(form ? form.concluida : (data.tarefa?.concluida ?? false));

	// contador de caracteres da descrição
	let digitado = $state(/** @type {number | null} */ (null));
	let contagem = $derived(digitado ?? descricao.length);

	$effect(() => {
		descricao;
		digitado = null;
	});
</script>

<main>
	<a href="/painel" class="voltar">← Voltar para as tarefas</a>

	<header class="topo">
		<h1>{editando ? "Editar tarefa" : "Nova tarefa"}</h1>
		<p class="subtitulo">
			{editando ? "Altere os dados e salve." : "Preencha os dados para criar uma tarefa."}
		</p>
	</header>

	<section class="caixa">
		<form
			method="POST"
			use:enhance={() => {
				enviando = true;
				return async ({ update }) => {
					await update({ reset: false });
					enviando = false;
				};
			}}
		>
			{#if form?.erro}
				<p class="erro" role="alert">{form.erro}</p>
			{/if}

			{#if editando}
				<input type="hidden" name="id" value={data.tarefa.id} />
			{/if}

			<div class="campo">
				<label for="titulo">Título</label>
				<input
					id="titulo"
					name="titulo"
					type="text"
					value={titulo}
					placeholder="Ex: Estudar para a prova"
					autocomplete="off"
					required
				/>
				<span class="dica">Mínimo de 3 caracteres.</span>
			</div>

			<div class="campo">
				<label for="descricao">Descrição <span class="opcional">(opcional)</span></label>
				<textarea
					id="descricao"
					name="descricao"
					rows="4"
					maxlength="500"
					placeholder="Detalhes, links, o que precisa ser feito..."
					value={descricao}
					oninput={(e) => (digitado = e.currentTarget.value.length)}
				></textarea>
				<span class="dica contador">{contagem}/500</span>
			</div>

			<div class="linha">
				<div class="campo">
					<label for="prazo">Prazo <span class="opcional">(opcional)</span></label>
					<input id="prazo" name="prazo" type="date" value={prazo} />
				</div>

				<fieldset class="campo">
					<legend>Prioridade</legend>
					<div class="segmentos">
						{#each PRIORIDADES as p (p.id)}
							<label class="segmento {p.id}">
								<input
									type="radio"
									name="prioridade"
									value={p.id}
									checked={prioridade === p.id}
								/>
								<span>{p.nome}</span>
							</label>
						{/each}
					</div>
				</fieldset>
			</div>

			<label class="check-linha">
				<input type="checkbox" name="concluida" checked={concluida} />
				<span>{concluida ? "Já está concluída" : "Marcar como concluída"}</span>
			</label>

			<div class="acoes">
				<button type="submit" class="botao" disabled={enviando}>
					{#if enviando}
						Salvando...
					{:else}
						{editando ? "Salvar alterações" : "Criar tarefa"}
					{/if}
				</button>
				<a href="/painel" class="botao secundario">Cancelar</a>
			</div>
		</form>
	</section>
</main>

<style>
	main {
		max-width: 600px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: system-ui, sans-serif;
		color: var(--text-color);
	}

	.voltar {
		display: inline-block;
		margin-bottom: 1rem;
		color: var(--accent);
		text-decoration: none;
	}

	.voltar:hover {
		text-decoration: underline;
	}

	.topo {
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

	/* ---------- Caixa do formulário ---------- */
	.caixa {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		box-shadow: var(--shadow);
		padding: 1.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.campo {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		min-width: 0;
	}

	label,
	legend {
		padding: 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-bold);
	}

	fieldset {
		margin: 0;
		padding: 0;
		border: none;
	}

	.opcional {
		font-weight: 400;
		color: var(--text-muted);
	}

	input[type="text"],
	input[type="date"],
	textarea {
		box-sizing: border-box;
		width: 100%;
		padding: 0.7rem 0.9rem;
		font-family: inherit;
		font-size: 1rem;
		color: var(--text-color);
		background: var(--surface-alt);
		border: 1px solid var(--border);
		border-radius: 8px;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	textarea {
		resize: vertical;
		line-height: 1.5;
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--text-muted);
		opacity: 0.8;
	}

	input[type="text"]:focus,
	input[type="date"]:focus,
	textarea:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent);
	}

	.dica {
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.contador {
		text-align: right;
	}

	.linha {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	/* ---------- Prioridade (3 botões lado a lado) ---------- */
	.segmentos {
		display: flex;
		gap: 0.4rem;
	}

	.segmento {
		position: relative;
		flex: 1;
		cursor: pointer;
		--cor: var(--accent);
	}

	.segmento.alta {
		--cor: var(--err);
	}

	.segmento.media {
		--cor: #d99a00;
	}

	.segmento.baixa {
		--cor: #1f9d55;
	}

	.segmento input {
		position: absolute;
		opacity: 0;
		inset: 0;
		margin: 0;
		cursor: pointer;
	}

	.segmento span {
		display: block;
		padding: 0.62rem 0.4rem;
		text-align: center;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-muted);
		background: var(--surface-alt);
		border: 1px solid var(--border);
		border-radius: 8px;
		transition:
			background 0.15s,
			border-color 0.15s,
			color 0.15s;
	}

	.segmento:hover span {
		border-color: var(--cor);
	}

	.segmento input:checked + span {
		color: color-mix(in srgb, var(--cor) 70%, var(--text-bold));
		background: color-mix(in srgb, var(--cor) 16%, var(--surface));
		border-color: var(--cor);
	}

	.segmento input:focus-visible + span {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* ---------- Bolinha de concluir (igual à do painel) ---------- */
	.check-linha {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		font-weight: 500;
		color: var(--text-color);
		cursor: pointer;
		width: fit-content;
	}

	.check-linha input {
		appearance: none;
		-webkit-appearance: none;
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		margin: 0;
		background: transparent;
		border: 2px solid var(--text-muted);
		border-radius: 50%;
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s,
			transform 0.15s;
	}

	.check-linha input::after {
		content: "✓";
		font-size: 0.85rem;
		font-weight: 700;
		line-height: 1;
		color: #fff;
		opacity: 0;
	}

	.check-linha input:hover {
		border-color: var(--selo-feito-text);
		transform: scale(1.1);
	}

	.check-linha input:checked {
		background: var(--selo-feito-text);
		border-color: var(--selo-feito-text);
	}

	.check-linha input:checked::after {
		opacity: 1;
	}

	.check-linha input:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* ---------- Erro ---------- */
	.erro {
		margin: 0;
		padding: 0.7rem 1rem;
		background: color-mix(in srgb, var(--err) 12%, var(--surface));
		border-left: 4px solid var(--err);
		border-radius: 0 8px 8px 0;
		color: var(--err);
		font-size: 0.9rem;
	}

	/* ---------- Botões ---------- */
	.acoes {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		margin-top: 0.3rem;
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
		text-align: center;
		text-decoration: none;
		cursor: pointer;
		transition:
			filter 0.15s,
			transform 0.15s;
	}

	.botao:hover:not(:disabled) {
		filter: brightness(1.1);
		transform: translateY(-1px);
	}

	.botao.secundario {
		background: var(--btn-secondary);
		color: var(--accent-contrast);
	}

	.botao:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	@media (max-width: 520px) {
		.linha {
			grid-template-columns: 1fr;
		}

		.acoes {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>