<script>
	import NavBar from "$lib/componets/Nav_bar.svelte";
</script>

	<NavBar/>

<main>
	<div class="box">
		<h1>Bem-vindo ao Sistema</h1>
		<p>
			Gerencie tudo em um só lugar. Faça login para acessar seu painel e
			começar a organizar suas informações.
		</p>
		<a class="cta" href="/login">Acessar Login</a>
	</div>
</main>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			Roboto,
			"Helvetica Neue",
			Arial,
			"Noto Sans",
			sans-serif;
	}

	:global(body) {
		background: rgb(13, 17, 23);
	}

	main {
		min-height: calc(100vh - 3.5rem);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.box {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 6rem 1.5rem;
	}

	.box h1 {
		font-size: 2.25rem;
		margin: 0 0 0.75rem;
		color: #fff;
	}

	main p {
		max-width: 40rem;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.6;
		margin: 0 0 2rem;
	}

	.cta {
		display: inline-block;
		padding: 0.75rem 2rem;
		background: var(--orange_svelte, #ff4500);
		color: #fff;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.cta:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 12px -4px rgba(255, 69, 0, 0.5);
	}
</style>
