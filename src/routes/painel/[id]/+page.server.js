import { error, redirect } from "@sveltejs/kit";
import { tarefas } from "$lib/servidor/dados";

function buscar(params, cookies) {
	const usuario = cookies.get("sessao");
	const tarefa = tarefas.find(
		(t) => t.id === Number(params.id) && t.dono === usuario,
	);
	if (!tarefa) error(404, "Tarefa não encontrada");
	return tarefa;
}

export function load({ params, cookies }) {
	return { tarefa: buscar(params, cookies) };
}

export const actions = {
	deletar: async ({ params, cookies }) => {
		const tarefa = buscar(params, cookies);
		tarefas.splice(tarefas.indexOf(tarefa), 1);
		redirect(303, "/painel");
	},
};