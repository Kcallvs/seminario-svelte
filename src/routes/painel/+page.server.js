import { redirect } from "@sveltejs/kit";
import { tarefas } from "$lib/servidor/dados";

export function load({ cookies }) {
	const usuario = cookies.get("sessao");
	return {
		tarefas: tarefas.filter((t) => t.dono === usuario),
	};
}

export const actions = {
	sair: async ({ cookies }) => {
		cookies.delete("sessao", { path: "/" });
		redirect(303, "/login");
	},

	deletar: async ({ request, cookies }) => {
		const form = await request.formData();
		const id = Number(form.get("id"));
		const usuario = cookies.get("sessao");

		const i = tarefas.findIndex((t) => t.id === id && t.dono === usuario);
		if (i !== -1) tarefas.splice(i, 1);

		redirect(303, "/painel");
	},
};