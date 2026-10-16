import { error, fail, redirect } from "@sveltejs/kit";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { tarefas, novoID } from "$lib/servidor/dados.js";
import { PRIORIDADES, prazoValido } from "$lib/tarefas.js";
import { PASTA_UPLOADS, TIPOS, TAMANHO_MAX, apagarArquivo } from "$lib/servidor/uploads.js";

export function load({ url, cookies }) {
	const idParam = url.searchParams.get("editar");
	if (idParam === null) return { tarefa: null };

	const usuario = cookies.get("sessao");
	const tarefa = tarefas.find((t) => t.id === Number(idParam) && t.dono === usuario);
	if (!tarefa) error(404, "Tarefa não encontrada");

	return { tarefa };
}

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const idRaw = form.get("id")?.toString() ?? "";
		const titulo = form.get("titulo")?.toString().trim() ?? "";
		const descricao = form.get("descricao")?.toString().trim() ?? "";
		const prazo = form.get("prazo")?.toString() ?? "";
		const prioridadeRaw = form.get("prioridade")?.toString() ?? "media";
		const prioridade = PRIORIDADES.some((p) => p.id === prioridadeRaw)
			? prioridadeRaw
			: "media";
		const concluida = form.get("concluida") === "on";
		const remover = form.get("removerImagem") === "on";
		const arquivo = form.get("imagem");
		const usuario = cookies.get("sessao");

		const valores = { titulo, descricao, prazo, prioridade, concluida };

		if (titulo.length < 3) {
			return fail(400, {
				erro: "O título precisa ter pelo menos 3 caracteres.",
				...valores
			});
		}

		if (descricao.length > 500) {
			return fail(400, {
				erro: "A descrição pode ter no máximo 500 caracteres.",
				...valores
			});
		}

		if (prazo && !prazoValido(prazo)) {
			return fail(400, { erro: "Data de prazo inválida.", ...valores });
		}

		// ---------- Imagem ----------
		const temArquivo = arquivo instanceof File && arquivo.size > 0;

		if (temArquivo) {
			if (!TIPOS[arquivo.type]) {
				return fail(400, { erro: "Envie uma imagem PNG, JPG, WEBP ou GIF.", ...valores });
			}
			if (arquivo.size > TAMANHO_MAX) {
				return fail(400, { erro: "A imagem pode ter no máximo 2 MB.", ...valores });
			}
		}

		/** @type {string | undefined} */
		let novaImagem;
		if (temArquivo) {
			const nome = randomUUID() + TIPOS[arquivo.type];
			await mkdir(PASTA_UPLOADS, { recursive: true });
			await writeFile(path.join(PASTA_UPLOADS, nome), Buffer.from(await arquivo.arrayBuffer()));
			novaImagem = `/uploads/${nome}`;
		}

		// ---------- Salvar ----------
		if (idRaw) {
			const tarefa = tarefas.find((t) => t.id === Number(idRaw) && t.dono === usuario);
			if (!tarefa) error(404, "Tarefa não encontrada");

			Object.assign(tarefa, valores);

			if (novaImagem) {
				await apagarArquivo(tarefa.imagem);
				tarefa.imagem = novaImagem;
			} else if (remover) {
				await apagarArquivo(tarefa.imagem);
				tarefa.imagem = null;
			}
		} else {
			tarefas.push({ id: novoID(), ...valores, imagem: novaImagem ?? null, dono: usuario });
		}

		redirect(303, "/painel");
	}
};