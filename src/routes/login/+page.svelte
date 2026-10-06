<script>
  import NavBar from "$lib/componets/Nav_bar.svelte";

  /** @type {{ form: import('./$types').ActionData }} */
  let { form } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<NavBar />
<div class="pagina">
  <div class="esquerda"></div>

  <div class="direita">
    <div class="conteudo">
      <h1>Bem-vindo de volta</h1>
      <p class="subtitulo">
        Entre com sua conta para ver suas tarefas de hoje.
      </p>

      {#if form?.erro}
        <p class="erro">{form.erro}</p>
      {/if}

      <form method="POST">
        <label for="usuario">Usuário</label>
        <input
          id="usuario"
          name="usuario"
          autocomplete="username"
          value={form?.usuario ?? ""}
          required
          placeholder="Use: admin"
        />

        <label for="senha">Senha</label>
        <div class="campo-senha">
          <input
            id="senha"
            name="senha"
            type="password"
            autocomplete="current-password"
            required
            placeholder="Use: 1234"
          />
        </div>

        <button type="submit" class="entrar">Entrar</button>
      </form>
    </div>
  </div>
</div>

<style>
  .pagina {
    display: flex;
    min-height: 100vh;
    font-family: "Fira Sans", sans-serif;
  }

  .esquerda {
    flex: 1;
    background: var( --orange_svelte);
  }

  .direita {
    flex: 1;
    background: var( --surface);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .conteudo {
    width: 100%;
    max-width: 420px;
  }

  h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    color: var(--label-text);
  }

  .subtitulo {
    margin: 0 0 1.5rem;
    color: var(--text-bold);
  }

  .erro {
    color: var(--err);
  }

  label {
    display: block;
    margin: 1rem 0 0.4rem;
    font-weight: bold;
    color: var( --label-text);
  }

  input:not([type]),
  input[type="password"] {
    width: 100%;
    box-sizing: border-box;
    padding: 0.9rem 1rem;
    background: #e8eefc;
    border: 1px solid #d3dcf5;
    font: inherit;
  }

  .campo-senha {
    position: relative;
  }

  .campo-senha input {
    padding-right: 5.5rem;
  }

  .entrar {
    width: 100%;
    padding: 0.9rem;
    margin-top: 1.5rem;
    background: #ff3e00;
    color: #fff;
    border: none;
    font: inherit;
    font-weight: bold;
    cursor: pointer;
  }

  @media (max-width: 700px) {
    .esquerda {
      display: none;
    }
  }
</style>