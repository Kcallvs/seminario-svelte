
<script>
    let {ref,name} = $props();
</script>


<a href={ref}>{name}</a>

<style>
    a {
		background: #ff3e00;
		color: white;
		text-decoration: none;
		padding: 0.7rem 5rem;
		border-radius: 0.25rem;
		font-weight: 600;
		box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.2), /* 20% opacity */
    0 8px 10px -6px rgba(0, 0, 0, 0.2);
	}

	a:hover {
		background: #d93500;
	}
</style>