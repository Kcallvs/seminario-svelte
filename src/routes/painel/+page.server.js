import { error, redirect } from "@sveltejs/kit";

export async function load({ cookies, fetch }) {
    const usuario = cookies.get("sessao");

    if (!usuario) {
        redirect(303, "/login");
    }

    const resposta = await fetch("/api/dados");

    if (resposta.status === 401) {
        redirect(303, "/login");
    }

    if (!resposta.ok) {
        error(resposta.status, "Não foi possível carregar as tarefas.");
    }

    return {
        tarefas: await resposta.json()
    };
}

export const actions = {
    sair: async ({ cookies }) => {
        cookies.delete("sessao", { path: "/" });
        redirect(303, "/login");
    }
};