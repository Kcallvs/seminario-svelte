<script>
	let { ref, name } = $props();
	import "$lib/styles/theme.css";
</script>

<a href={ref}>{name}</a>

<style>
	a {
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

		color: gray;
		color: rgba(255, 255, 255, 0.75);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
	}

	a:hover {
		color: var(--orange_svelte);
		transition: all 0.5s;
	}
</style>
