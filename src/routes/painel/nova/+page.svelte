<script>
	import { enhance } from "$app/forms";
	import NavBar from "$lib/componets/Nav_bar.svelte";

	/** @type {{ form: import('./$types').ActionData }} */
	let { form } = $props();


    /**@type {boolean}*/
	let enviando = $state(false);
</script>

<NavBar />

<main>
	<header class="topo">
		<div>
			<h1>Nova tarefa</h1>
			<p class="subtitulo">Preencha os dados para criar uma tarefa.</p>
		</div>
	</header>

	<section class="caixa">
		<form
			method="POST"
			use:enhance={() => {
				enviando = true;
				return async ({ update }) => {
					await update();
					enviando = false;
				};
			}}
		>
			{#if form?.erro}
				<p class="erro">{form.erro}</p>
			{/if}

			<label for="titulo">Título</label>
			<input
				id="titulo"
				name="titulo"
				type="text"
				value={form?.titulo ?? ""}
				placeholder="Ex: Estudar para a prova"
				required
			/>

			<label class="check">
				<input type="checkbox" name="concluida" />
				Já está concluída
			</label>

			<div class="acoes">
				<button type="submit" disabled={enviando}>
					{enviando ? "Salvando..." : "Criar tarefa"}
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
		font-family: system-ui, sans-serif;
		padding: 0 1rem;
		color: #222;
	}

	.topo {
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

	.caixa {
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
	}

	input[type="text"] {
		padding: 0.6rem 0.8rem;
		font-size: 1rem;
		border: 1px solid #ddd;
		border-radius: 6px;
	}

	input[type="text"]:focus {
		outline: none;
		border-color: #ff3e00;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 400;
	}

	.erro {
		background: #fdecea;
		border-left: 4px solid #c62828;
		color: #c62828;
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
		background: #ff3e00;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.cancelar {
		color: #6b6b6b;
		text-decoration: none;
	}

	.voltar {
		display: inline-block;
		margin-top: 1.5rem;
		color: #ff3e00;
		text-decoration: none;
	}
</style>