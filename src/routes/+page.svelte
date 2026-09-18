<main>
	<h1>Demo: Svelte + SvelteKit</h1>
	<p>
		Projeto de exemplo para o seminário. Navegue pelas telas abaixo para ver
		o componente reativo, o login, o middleware protegendo uma rota e a
		comunicação via HTTPS em ação.
	</p>

	<nav>
		<a href="/login">1. Fazer login</a>
		<a href="/painel">2. Painel (protegido pelo middleware)</a>
		<a href="/sobre">3. Sobre a segurança (HTTPS)</a>
	</nav>
</main>

<style>
	main {
		max-width: 640px;
		margin: 2rem auto;
		font-family: system-ui, sans-serif;
		padding: 0 1rem;
	}
	nav {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}
	nav a {
		background: #ff3e00;
		color: white;
		text-decoration: none;
		padding: 0.7rem 1.2rem;
		border-radius: 6px;
		font-weight: 600;
	}
	nav a:hover {
		background: #d93500;
	}
</style>
