<script>
    import Card from "$lib/componets/Card.svelte";
	import Link from "$lib/componets/Link.svelte";
	import favicon from "$lib/assets/favicon.svg";
	let name = $state('login');
	
	function change_name(name_get){
		
		if(name_get!==null){
			name = name_get;
		}

	}

</script>

<nav>
	<img src={favicon} alt="Logo do Svelte" />
	<Link ref="/login" name="login" hover_func={change_name} />
	<Link ref="/painel" name="Painel" hover_func={change_name} />
	<Link ref="/sobre" name="Sobre" hover_func={change_name} />
</nav>

<main>
	<Card main={name} sub_text="..." />
</main>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: system-ui, sans-serif;
	}

	nav img{
		width: 4rem;
		height: 4rem;
	}

	main{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;

		height: 50rem;
		background: rgb(13, 17, 23);
		

	}

	nav {
	
		height: 5rem;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 0.75rem;
		background:rgb(13, 17, 23);
		
		border-bottom: 0.5rem solid var( --orange_svelte);

		
	}

	

</style>
