import { fail, redirect } from "@sveltejs/kit";
import { tarefas, novoID } from "$lib/servidor/dados.js";

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const titulo = form.get("titulo")?.toString().trim() ?? "";
		const concluida = form.get("concluida") === "on";

		if (titulo.length < 3) {
			return fail(400, {
				erro: "O título precisa ter pelo menos 3 caracteres.",
				titulo,
			});
		}

		tarefas.push({
			id: novoID(),
			titulo,
			concluida,
			dono: cookies.get("sessao"),
		});

		redirect(303, "/painel");
	},
};