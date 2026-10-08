import { error, fail, redirect } from "@sveltejs/kit";
import { tarefas, novoID } from "$lib/servidor/dados.js";

export function load({ url, cookies }) {
	const idParam = url.searchParams.get("editar");
	if (idParam === null) return { tarefa: null };

	const usuario = cookies.get("sessao");
	const tarefa = tarefas.find(
		(t) => t.id === Number(idParam) && t.dono === usuario,
	);
	if (!tarefa) error(404, "Tarefa não encontrada");

	return { tarefa };
}

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const idRaw = form.get("id")?.toString() ?? "";
		const titulo = form.get("titulo")?.toString().trim() ?? "";
		const concluida = form.get("concluida") === "on";
		const usuario = cookies.get("sessao");

		if (titulo.length < 3) {
			return fail(400, {
				erro: "O título precisa ter pelo menos 3 caracteres.",
				titulo,
				concluida,
			});
		}

		if (idRaw) {
			const tarefa = tarefas.find(
				(t) => t.id === Number(idRaw) && t.dono === usuario,
			);
			if (!tarefa) error(404, "Tarefa não encontrada");

			tarefa.titulo = titulo;
			tarefa.concluida = concluida;
		} else {
			tarefas.push({ id: novoID(), titulo, concluida, dono: usuario });
		}

		redirect(303, "/painel");
	},
};