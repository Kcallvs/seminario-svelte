<script>

    let { main, sub_text, colo } = $props();

</script>

<div>
    <div class="card">
        <div class="card_text">
            <h1>{main}</h1>
            <span for="">{sub_text}</span>
        </div>
        <div class="card_color"></div>
    </div>
</div>

<style>

    
    .card {
        display: flex;
        justify-content: space-evenly;

        border: 0.125rem solid var( --orange_svelte);
        border-radius: 2rem;
        padding: 1.5rem;
        gap: 0.75rem;
        transition: opacity 0.3s ease;
    }

    

    .card:hover{
        opacity: 0.6;
    }

    .card_color {
        background-color: var( --orange_svelte);
        width: 10rem;
        height: 8rem;
        border-radius: 1.5rem;
    }
    


    .card:hover{
        border: 0.125rem solid var( --orange_svelte);
        transition: all 0.5s;
    }

    .card_text {
        display: flex;
        flex-direction: column;
        justify-content: end;
        color: var( --orange_svelte);
    }

    .card_text h1 {
        margin: 0;
    }

    .card_text span {
        margin: 0;
        color: var( --orange_svelte);
    }
</style>
