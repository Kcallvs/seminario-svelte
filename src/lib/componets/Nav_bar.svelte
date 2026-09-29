<script>
	import favicon from "$lib/assets/favicon.svg";
	import dark from "$lib/assets/dark-mode.svg";
	import Link from "./Link.svelte";

	

	function change_theme() {}
</script>
<!-- <nav style:background={s}></nav> -->
<nav >
	<div class="nav-left">
		<img src={favicon} alt="Logo" class="logo" />
		<span class="brand">SISTEMA</span>
		<div class="nav-links">
			<Link name="Login" ref="/login" />
			<Link name="Painel" ref="/painel" />
			<Link name="Sobre" ref="/sobre" />
		</div>
	</div>

	<div class="nav-right">
		<button onclick={change_theme}>
			<img src={dark} alt="dark" class="logo dark" />
		</button>
	</div>
</nav>

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
	button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
	}

	nav {
		height: 3.5rem;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1.5rem;
		background: rgb(13, 17, 23);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.nav-left {
		display: flex;
		align-items: center;
		gap: 1.75rem;
	}

	.nav-right {
		margin-left: auto;
		display: flex;
		align-items: center;
	}

	.logo {
		width: 1.75rem;
		height: 1.75rem;
	}

	img.dark {
		filter: invert(1);
	}

	.brand {
		color: #fff;
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.05em;
		margin-right: 0.5rem;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
</style>
