
<script>
    let {ref,name,hover_func} = $props();
	import '$lib/styles/theme.css';
</script>


<a onmouseenter={()=> hover_func?.(name)} onmouseleave={()=> hover_func?.(null)} href={ref}>
	<h2>{name}</h2>
</a>

<style>
	
    a {
		color: gray;
		text-decoration: none;
		border-radius: 2rem;
		width: 5rem;
		height: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.5s;
	
	}

	a:hover {
		color: var( --orange_svelte);
		transition: all 0.5s;
	}
</style>