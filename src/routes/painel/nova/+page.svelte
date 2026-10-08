<script>
	import { enhance } from "$app/forms";

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();

	/** @type {boolean} */
	let enviando = $state(false);

	let editando = $derived(data.tarefa !== null);
	let titulo = $derived(form?.titulo ?? data.tarefa?.titulo ?? "");
	let concluida = $derived(form ? form.concluida : (data.tarefa?.concluida ?? false));
</script>

<main>
	<header class="topo">
		<div>
			<h1>{editando ? "Editar tarefa" : "Nova tarefa"}</h1>
			<p class="subtitulo">
				{editando
					? "Altere os dados e salve."
					: "Preencha os dados para criar uma tarefa."}
			</p>
		</div>
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
				<p class="erro">{form.erro}</p>
			{/if}

			{#if editando}
				<input type="hidden" name="id" value={data.tarefa.id} />
			{/if}

			<label for="titulo">Título</label>
			<input
				id="titulo"
				name="titulo"
				type="text"
				value={titulo}
				placeholder="Ex: Estudar para a prova"
				required
			/>

			<label class="check">
				<input type="checkbox" name="concluida" checked={concluida} />
				Já está concluída
			</label>

			<div class="acoes">
				<button type="submit" disabled={enviando}>
					{#if enviando}
						Salvando...
					{:else}
						{editando ? "Salvar alterações" : "Criar tarefa"}
					{/if}
				</button>
				<a href="/painel" class="cancelar">Cancelar</a>
			</div>
		</form>
	</section>

	<a href="/painel" class="voltar">← Voltar</a>
</main>
<style>
	main {
		max-width: 600px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: system-ui, sans-serif;
		color: var(--text-color);
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

	.caixa {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 10px;
		box-shadow: var(--shadow);
		padding: 1.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	label {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-color);
	}

	input[type="text"] {
		padding: 0.6rem 0.8rem;
		font-family: inherit;
		font-size: 1rem;
		color: var(--text-color);
		background: var(--surface-alt);
		border: 1px solid var(--border);
		border-radius: 6px;
	}

	input[type="text"]::placeholder {
		color: var(--text-muted);
		opacity: 0.7;
	}

	input[type="text"]:focus {
		outline: none;
		border-color: var(--accent);
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 400;
	}

	.check input {
		accent-color: var(--accent);
	}

	.erro {
		background: var(--aviso-bg);
		border-left: 4px solid var(--err);
		color: var(--err);
		padding: 0.6rem 1rem;
		font-size: 0.9rem;
		border-radius: 0 6px 6px 0;
		margin: 0;
	}

	.acoes {
		display: flex;
		gap: 0.8rem;
		align-items: center;
		margin-top: 0.5rem;
	}

	button {
		background: var(--accent);
		color: var(--accent-contrast);
		border: none;
		border-radius: 6px;
		padding: 0.6rem 1.2rem;
		font-family: inherit;
		font-size: 1rem;
		cursor: pointer;
		transition: filter 0.15s;
	}

	button:hover:not(:disabled) {
		filter: brightness(1.1);
	}

	button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.cancelar {
		color: var(--text-muted);
		text-decoration: none;
	}

	.voltar {
		display: inline-block;
		margin-top: 1.5rem;
		color: var(--accent);
		text-decoration: none;
	}
</style>