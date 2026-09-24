<script>
	import favicon from "$lib/assets/favicon.svg";
</script>

<nav>
	<div class="nav-left">
		<img src={favicon} alt="Logo" class="logo" />
		<span class="brand">SISTEMA</span>
		<div class="nav-links">
			<a href="/login">Login</a>
			<a href="/painel">Painel</a>
			<a href="/sobre">Sobre</a>
		</div>
	</div>
</nav>

<style>
	
	nav {
		height: 3.5rem;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		padding: 0 1.5rem;
		background: rgb(13, 17, 23);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.nav-left {
		display: flex;
		align-items: center;
		gap: 1.75rem;
	}

	.logo {
		width: 1.75rem;
		height: 1.75rem;
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

	.nav-links a {
		color: rgba(255, 255, 255, 0.75);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.nav-links a:hover {
		color: #fff;
	}

</style>