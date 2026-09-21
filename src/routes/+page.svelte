<script>
    import Link from "$lib/componets/Link.svelte";

</script>
<main>
	<h1>Demo: Svelte + SvelteKit</h1>
	<p>
		Projeto de exemplo para o seminário. Navegue pelas telas abaixo para ver
		o componente reativo, o login, o middleware protegendo uma rota e a
		comunicação via HTTPS em ação.
	</p>

	<div class="Box">
		<nav>
			<Link ref="/login" name="1. Fazer login" />
			<Link ref="/painel" name="2. Painel (protegido pelo middleware)" />
			<Link ref="/sobre" name="3. Sobre a segurança (HTTPS)" />
		</nav>
	</div>

</main>

<style>
	main {
		max-width: 640px;
		margin: 2rem auto;
		font-family: system-ui, sans-serif;
		padding: 0 1rem;
	}

	.Box{
		background-color: rgb(255, 255, 255);
		padding: 2rem;
		border-radius: 0.25rem;
		display: flex;
		justify-content: center;
		box-shadow:0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

</style>
