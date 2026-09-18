<script>
	/** @type {{ form: import('./$types').ActionData }} */
	let { form } = $props();
</script>

<main>
	<h1>Login</h1>
	<p>Use <code>admin</code> / <code>1234</code> para entrar.</p>

	<form method="POST">
		<label>
			Usuário
			<input name="usuario" autocomplete="username" />
		</label>
		<label>
			Senha
			<input name="senha" type="password" autocomplete="current-password" />
		</label>
		<button type="submit">Entrar</button>
	</form>

	{#if form?.erro}
		<p class="erro">{form.erro}</p>
	{/if}

	<a href="/">← Voltar</a>
</main>

<style>
	main {
		max-width: 400px;
		margin: 2rem auto;
		font-family: system-ui, sans-serif;
		padding: 0 1rem;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1.5rem 0;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.9rem;
	}
	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	button {
		background: #ff3e00;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.6rem;
		font-size: 1rem;
		cursor: pointer;
	}
	.erro {
		color: #b00020;
	}
</style>
