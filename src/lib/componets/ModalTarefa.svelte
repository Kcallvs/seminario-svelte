<script>
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { PRIORIDADES, prioridadeDe } from "$lib/tarefas.js";

	/**
	 * @type {{
	 *   aberto: boolean,
	 *   tarefa?: any,
	 *   onfechar: () => void
	 * }}
	 */
	let { aberto, tarefa = null, onfechar } = $props();

	/** @type {HTMLDialogElement | undefined} */
	let dialogo = $state();

	let enviando = $state(false);
	let erro = $state("");

	let titulo = $state("");
	let descricao = $state("");
	let prazo = $state("");
	let prioridade = $state("media");
	let concluida = $state(false);

	let editando = $derived(tarefa !== null);

	// Abre/fecha o <dialog> e preenche os campos a cada abertura
	$effect(() => {
		if (!dialogo) return;

		if (aberto) {
			titulo = tarefa?.titulo ?? "";
			descricao = tarefa?.descricao ?? "";
			prazo = tarefa?.prazo ?? "";
			prioridade = tarefa ? prioridadeDe(tarefa) : "media";
			concluida = tarefa?.concluida ?? false;
			erro = "";
			enviando = false;

			if (!dialogo.open) dialogo.showModal();
		} else if (dialogo.open) {
			dialogo.close();
		}
	});

	/** @param {MouseEvent} e */
	function cliqueFora(e) {
		// clicar no fundo escurecido (o próprio <dialog>) fecha o modal
		if (e.target === dialogo) onfechar();
	}
</script>

<dialog bind:this={dialogo} class="modal" onclose={onfechar} onclick={cliqueFora}>
	<header class="modal-topo">
		<div>
			<h2>{editando ? "Editar tarefa" : "Nova tarefa"}</h2>
			<p class="subtitulo">
				{editando ? "Altere os dados e salve." : "Preencha os dados para criar uma tarefa."}
			</p>
		</div>

		<button type="button" class="fechar" onclick={onfechar} aria-label="Fechar">✕</button>
	</header>

	<!-- Reaproveita a action da tela /painel/nova -->
	<form
		method="POST"
		action="/painel/nova"
		use:enhance={() => {
			enviando = true;
			erro = "";

			return async ({ result }) => {
				enviando = false;

				if (result.type === "failure") {
					erro = /** @type {any} */ (result.data)?.erro ?? "Não foi possível salvar a tarefa.";
				} else if (result.type === "error") {
					erro = "Erro inesperado. Tente novamente.";
				} else {
					// sucesso (ou redirect): fecha o modal e recarrega as tarefas do painel
					onfechar();
					await invalidateAll();
				}
			};
		}}
	>
		{#if erro}
			<p class="erro" role="alert">{erro}</p>
		{/if}

		{#if editando}
			<input type="hidden" name="id" value={tarefa.id} />
		{/if}

		<div class="campo">
			<label for="modal-titulo">Título</label>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				id="modal-titulo"
				name="titulo"
				type="text"
				bind:value={titulo}
				placeholder="Ex: Estudar para a prova"
				autocomplete="off"
				required
				autofocus
			/>
			<span class="dica">Mínimo de 3 caracteres.</span>
		</div>

		<div class="campo">
			<label for="modal-descricao">Descrição <span class="opcional">(opcional)</span></label>
			<textarea
				id="modal-descricao"
				name="descricao"
				rows="4"
				maxlength="500"
				placeholder="Detalhes, links, o que precisa ser feito..."
				bind:value={descricao}
			></textarea>
			<span class="dica contador">{descricao.length}/500</span>
		</div>

		<div class="linha">
			<div class="campo">
				<label for="modal-prazo">Prazo <span class="opcional">(opcional)</span></label>
				<input id="modal-prazo" name="prazo" type="date" bind:value={prazo} />
			</div>

			<fieldset class="campo">
				<legend>Prioridade</legend>
				<div class="segmentos">
					{#each PRIORIDADES as p (p.id)}
						<label class="segmento {p.id}">
							<input type="radio" name="prioridade" value={p.id} bind:group={prioridade} />
							<span>{p.nome}</span>
						</label>
					{/each}
				</div>
			</fieldset>
		</div>

		<label class="check-linha">
			<input type="checkbox" name="concluida" bind:checked={concluida} />
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
			<button type="button" class="botao secundario" onclick={onfechar}>Cancelar</button>
		</div>
	</form>
</dialog>

<style>
	/* ---------- Overlay ---------- */
	.modal {
		box-sizing: border-box;
		width: min(560px, calc(100vw - 2rem));
		max-height: calc(100dvh - 2rem);
		margin: auto;
		padding: 1.5rem;
		overflow-y: auto;
		background: var(--surface);
		color: var(--text-color);
		border: 1px solid var(--border);
		border-radius: 12px;
		box-shadow: 0 20px 60px rgb(0 0 0 / 0.35);
		font-family: system-ui, sans-serif;
	}

	.modal[open] {
		animation: entrar 0.16s ease-out;
	}

	.modal::backdrop {
		background: rgb(0 0 0 / 0.55);
		backdrop-filter: blur(2px);
	}

	.modal[open]::backdrop {
		animation: esmaecer 0.16s ease-out;
	}

	@keyframes entrar {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.98);
		}
	}

	@keyframes esmaecer {
		from {
			opacity: 0;
		}
	}

	.modal-topo {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.2rem;
	}

	h2 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--text-bold);
	}

	.subtitulo {
		margin: 0.3rem 0 0;
		color: var(--subtitulo);
	}

	.fechar {
		flex: none;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: none;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		color: var(--text-muted);
		cursor: pointer;
	}

	.fechar:hover {
		background: var(--surface-hover);
		color: var(--text-color);
	}

	/* ---------- Formulário ---------- */
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

	/* ---------- Prioridade ---------- */
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

	/* ---------- Bolinha de concluir ---------- */
	.check-linha {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		width: fit-content;
		font-weight: 500;
		color: var(--text-color);
		cursor: pointer;
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
		.modal {
			padding: 1.1rem;
		}

		.linha {
			grid-template-columns: 1fr;
		}

		.acoes {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>