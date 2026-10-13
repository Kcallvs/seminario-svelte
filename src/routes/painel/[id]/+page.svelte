<script>
	import { enhance } from "$app/forms";
	import { prioridadeDe, nomePrioridade, formatarPrazo, situacaoPrazo } from "$lib/tarefas.js";

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let t = $derived(data.tarefa);
	let sit = $derived(situacaoPrazo(t));

	/** @param {SubmitEvent} e */
	function confirmar(e) {
		if (!confirm("Deseja realmente deletar esta tarefa?")) {
			e.preventDefault();
		}
	}
</script>

<main>
	<a href="/painel" class="voltar">← Voltar para as tarefas</a>

	<article class="caixa">
		<header class="cabecalho">
			<div class="selos">
				<span class="selo" class:feito={t.concluida}>
					<i class="ponto-selo"></i>
					{t.concluida ? "Concluída" : "Pendente"}
				</span>
				<span class="prio {prioridadeDe(t)}">
					Prioridade {nomePrioridade(prioridadeDe(t)).toLowerCase()}
				</span>
			</div>

			<h1 class:riscado={t.concluida}>{t.titulo}</h1>
		</header>

		<dl class="detalhes">
			<div class="item">
				<dt>Descrição</dt>
				<dd class:vazio={!t.descricao}>
					{t.descricao || "Sem descrição."}
				</dd>
			</div>

			<div class="item">
				<dt>Prazo</dt>
				<dd class:vazio={!t.prazo}>
					{#if t.prazo}
						<span class:atrasada={sit === "atrasada"} class:hoje={sit === "hoje"}>
							{formatarPrazo(t.prazo)}
							{#if sit === "atrasada"}· Atrasada{:else if sit === "hoje"}· Vence hoje{/if}
						</span>
					{:else}
						Sem prazo.
					{/if}
				</dd>
			</div>
		</dl>

		<div class="acoes">
			<form method="POST" action="?/alternar" use:enhance>
				<button type="submit" class="botao">
					{t.concluida ? "Marcar como pendente" : "Marcar como concluída"}
				</button>
			</form>

			<a href="/painel/nova?editar={t.id}" class="botao secundario">Editar</a>

			<form method="POST" action="?/deletar" onsubmit={confirmar}>
				<button type="submit" class="botao perigo">Deletar</button>
			</form>
		</div>
	</article>
</main>

<style>
	main {
		max-width: 700px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: system-ui, sans-serif;
		color: var(--text-color);
	}

	.voltar {
		display: inline-block;
		margin-bottom: 1rem;
		color: var(--accent);
		text-decoration: none;
	}

	.voltar:hover {
		text-decoration: underline;
	}

	.caixa {
		padding: 1.5rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		box-shadow: var(--shadow);
	}

	.cabecalho {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.8rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1.2rem;
		border-bottom: 1px solid var(--border);
	}

	.selos {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	h1 {
		margin: 0;
		font-size: 1.8rem;
		color: var(--text-bold);
		overflow-wrap: anywhere;
	}

	h1.riscado {
		color: var(--text-muted);
		text-decoration: line-through;
	}

	/* ---------- Selos ---------- */
	.selo,
	.prio {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border-radius: 999px;
		padding: 0.2rem 0.75rem;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.selo {
		background: var(--selo-bg);
		color: var(--selo-text);
	}

	.selo.feito {
		background: var(--selo-feito-bg);
		color: var(--selo-feito-text);
	}

	.ponto-selo {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: currentColor;
	}

	.prio {
		--cor: #d99a00;
		color: color-mix(in srgb, var(--cor) 70%, var(--text-bold));
		background: color-mix(in srgb, var(--cor) 16%, var(--surface));
	}

	.prio.alta {
		--cor: var(--err);
	}

	.prio.media {
		--cor: #d99a00;
	}

	.prio.baixa {
		--cor: #1f9d55;
	}

	/* ---------- Detalhes ---------- */
	.detalhes {
		display: grid;
		gap: 1.2rem;
		margin: 0 0 1.5rem;
	}

	.item dt {
		margin-bottom: 0.25rem;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	.item dd {
		margin: 0;
		line-height: 1.6;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.item dd.vazio {
		color: var(--text-muted);
		font-style: italic;
	}

	.atrasada {
		color: var(--err);
		font-weight: 700;
	}

	.hoje {
		color: color-mix(in srgb, #d99a00 75%, var(--text-bold));
		font-weight: 700;
	}

	/* ---------- Botões ---------- */
	.acoes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.botao {
		display: inline-block;
		background: var(--accent);
		color: var(--accent-contrast);
		border: none;
		border-radius: 8px;
		padding: 0.6rem 1.2rem;
		font-family: inherit;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		transition:
			filter 0.15s,
			transform 0.15s;
	}

	.botao:hover {
		filter: brightness(1.1);
		transform: translateY(-1px);
	}

	.botao.secundario {
		background: var(--btn-secondary);
		color: var(--accent-contrast);
	}

	.botao.perigo {
		background: var(--err);
		color: #fff;
	}
</style>