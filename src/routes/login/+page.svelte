<script>
	import { enhance } from "$app/forms";

	/** @type {{ form: import('./$types').ActionData }} */
	let { form } = $props();

	let modo = $state(form?.modo ?? "login");
	let mostrarSenha = $state(false);
	let enviando = $state(false);

	$effect(() => {
		if (form?.modo) modo = form.modo;
	});

	function trocar(novo) {
		modo = novo;
		mostrarSenha = false;
	}

	const aoEnviar = () => {
		enviando = true;
		return async ({ update }) => {
			await update({ reset: false });
			enviando = false;
		};
	};
</script>

<svelte:head>
	<title>{modo === "login" ? "Entrar" : "Criar conta"}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="pagina">
	<aside class="esquerda">
		<div class="esquerda-conteudo">
			<img src="/imgs/svelte-grande.png" alt="" class="ilustracao" />
			<h2>Organize suas atividades</h2>
			<p>Cadastre, acompanhe e conclua suas tarefas do dia em um só lugar.</p>
		</div>
	</aside>

	<main class="direita">
		<div class="conteudo">
			<h1>{modo === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
			<p class="subtitulo">
				{modo === "login"
					? "Entre com sua conta para ver suas atividades de hoje."
					: "Preencha os dados abaixo para começar a organizar suas atividades."}
			</p>

			<div class="abas" role="tablist">
				<button
					type="button"
					role="tab"
					aria-selected={modo === "login"}
					class:ativa={modo === "login"}
					onclick={() => trocar("login")}>Entrar</button
				>
				<button
					type="button"
					role="tab"
					aria-selected={modo === "cadastro"}
					class:ativa={modo === "cadastro"}
					onclick={() => trocar("cadastro")}>Criar conta</button
				>
			</div>

			{#if form?.erro && form.modo === modo}
				<p class="aviso erro" role="alert">{form.erro}</p>
			{/if}
			{#if form?.sucesso && modo === "login"}
				<p class="aviso sucesso">{form.sucesso}</p>
			{/if}

			{#if modo === "login"}
				<form method="POST" action="?/login" use:enhance={aoEnviar}>
					<label for="usuario">Usuário</label>
					<input
						id="usuario"
						name="usuario"
						autocomplete="username"
						value={form?.usuario ?? ""}
						required
						placeholder="Seu usuário"
					/>

					<label for="senha">Senha</label>
					<div class="campo-senha">
						<input
							id="senha"
							name="senha"
							type={mostrarSenha ? "text" : "password"}
							autocomplete="current-password"
							required
							placeholder="Sua senha"
						/>
						<button type="button" class="olho" onclick={() => (mostrarSenha = !mostrarSenha)}>
							{mostrarSenha ? "Ocultar" : "Mostrar"}
						</button>
					</div>

					<button type="submit" class="entrar" disabled={enviando}>
						{enviando ? "Entrando..." : "Entrar"}
					</button>
				</form>
			{:else}
				<form method="POST" action="?/cadastro" use:enhance={aoEnviar}>
					<label for="nome">Nome completo</label>
					<input
						id="nome"
						name="nome"
						autocomplete="name"
						value={form?.nome ?? ""}
						required
						placeholder="Seu nome"
					/>

					<label for="novo-usuario">Usuário</label>
					<input
						id="novo-usuario"
						name="usuario"
						autocomplete="username"
						value={form?.usuario ?? ""}
						required
						placeholder="Escolha um usuário"
					/>

					<label for="nova-senha">Senha</label>
					<div class="campo-senha">
						<input
							id="nova-senha"
							name="senha"
							type={mostrarSenha ? "text" : "password"}
							autocomplete="new-password"
							minlength="6"
							required
							placeholder="Mínimo de 6 caracteres"
						/>
						<button type="button" class="olho" onclick={() => (mostrarSenha = !mostrarSenha)}>
							{mostrarSenha ? "Ocultar" : "Mostrar"}
						</button>
					</div>

					<label for="confirmar">Confirmar senha</label>
					<input
						id="confirmar"
						name="confirmar"
						type={mostrarSenha ? "text" : "password"}
						autocomplete="new-password"
						minlength="6"
						required
						placeholder="Repita a senha"
					/>

					<button type="submit" class="entrar" disabled={enviando}>
						{enviando ? "Criando conta..." : "Criar conta"}
					</button>
				</form>
			{/if}

			<p class="troca">
				{#if modo === "login"}
					Ainda não tem conta?
					<button type="button" class="link" onclick={() => trocar("cadastro")}>Cadastre-se</button>
				{:else}
					Já tem conta?
					<button type="button" class="link" onclick={() => trocar("login")}>Entrar</button>
				{/if}
			</p>
		</div>
	</main>
</div>

<style>
	.pagina {
		display: flex;
		min-height: 100vh;
		font-family: "Fira Sans", sans-serif;
	}

	.esquerda {
		flex: 1;
		background: var(--orange_svelte);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		color: #fff;
	}

	.esquerda-conteudo {
		max-width: 30rem;
		text-align: center;
	}

	.ilustracao {
		width: 100%;
		height: auto;
		margin-bottom: 1.5rem;
	}

	.esquerda h2 {
		margin: 0 0 0.5rem;
		font-size: 1.75rem;
	}

	.esquerda p {
		margin: 0;
		opacity: 0.92;
		line-height: 1.5;
	}

	.direita {
		flex: 1;
		background: var(--surface);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.conteudo {
		width: 100%;
		max-width: 420px;
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: 2rem;
		color: var(--label-text);
	}

	.subtitulo {
		margin: 0 0 1.5rem;
		color: var(--text-bold);
	}

	.erro {
		color: var(--err);
	}

	label {
		display: block;
		margin: 1rem 0 0.4rem;
		font-weight: bold;
		color: var(--label-text);
	}

	input:not([type]),
	input[type="password"],
	input[type="text"] {
		width: 100%;
		box-sizing: border-box;
		padding: 0.9rem 1rem;
		font: inherit;
		color: var(--label-text);
		background: color-mix(in srgb, var(--label-text) 8%, var(--surface));
		border: 1px solid color-mix(in srgb, var(--label-text) 22%, var(--surface));
	}

	input::placeholder {
		color: color-mix(in srgb, var(--label-text) 45%, transparent);
	}

	input:focus {
		outline: 2px solid var(--orange_svelte);
		outline-offset: 0;
	}

	.campo-senha {
		position: relative;
	}

	.campo-senha input {
		padding-right: 5.5rem;
	}

	.entrar {
		width: 100%;
		padding: 0.9rem;
		margin-top: 1.5rem;
		background: var(--orange_svelte);
		color: #fff;
		border: none;
		font: inherit;
		font-weight: bold;
		cursor: pointer;
	}

	.entrar:disabled {
		opacity: 0.65;
		cursor: wait;
	}

	/* ---- abas, avisos, mostrar senha e links ---- */

	.abas {
		display: flex;
		margin: 0 0 1.25rem;
		border-bottom: 2px solid color-mix(in srgb, var(--label-text) 18%, var(--surface));
	}

	.abas button {
		flex: 1;
		padding: 0.7rem;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		font: inherit;
		font-weight: bold;
		color: var(--text-bold);
		cursor: pointer;
	}

	.abas button.ativa {
		color: var(--orange_svelte);
		border-bottom-color: var(--orange_svelte);
	}

	.aviso {
		margin: 0 0 1rem;
		padding: 0.7rem 1rem;
	}

	.aviso.erro {
		color: var(--err);
		background: color-mix(in srgb, var(--err) 12%, var(--surface));
		border: 1px solid color-mix(in srgb, var(--err) 40%, var(--surface));
	}

	.aviso.sucesso {
		color: color-mix(in srgb, #1f9d55 60%, var(--label-text));
		background: color-mix(in srgb, #1f9d55 14%, var(--surface));
		border: 1px solid color-mix(in srgb, #1f9d55 40%, var(--surface));
	}

	.olho {
		position: absolute;
		top: 50%;
		right: 0.5rem;
		transform: translateY(-50%);
		padding: 0.35rem 0.6rem;
		background: none;
		border: none;
		font: inherit;
		font-size: 0.85rem;
		font-weight: bold;
		color: var(--orange_svelte);
		cursor: pointer;
	}

	.troca {
		margin: 1.5rem 0 0;
		text-align: center;
		color: var(--text-bold);
	}

	.link {
		padding: 0;
		background: none;
		border: none;
		font: inherit;
		font-weight: bold;
		color: var(--orange_svelte);
		cursor: pointer;
	}

	@media (max-width: 700px) {
		.esquerda {
			display: none;
		}
	}
</style>