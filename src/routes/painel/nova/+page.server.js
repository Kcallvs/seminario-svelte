import { error, fail, redirect } from "@sveltejs/kit";
import { tarefas, novoID } from "$lib/servidor/dados.js";
import { PRIORIDADES, prazoValido } from "$lib/tarefas.js";

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
        const descricao = form.get("descricao")?.toString().trim() ?? "";
        const prazo = form.get("prazo")?.toString() ?? "";
        const prioridadeRaw = form.get("prioridade")?.toString() ?? "media";
        const prioridade = PRIORIDADES.some((p) => p.id === prioridadeRaw)
            ? prioridadeRaw
            : "media";
        const concluida = form.get("concluida") === "on";
        const usuario = cookies.get("sessao");

        const valores = { titulo, descricao, prazo, prioridade, concluida };

        if (titulo.length < 3) {
            return fail(400, {
                erro: "O título precisa ter pelo menos 3 caracteres.",
                ...valores,
            });
        }

        if (descricao.length > 500) {
            return fail(400, {
                erro: "A descrição pode ter no máximo 500 caracteres.",
                ...valores,
            });
        }

        if (prazo && !prazoValido(prazo)) {
            return fail(400, { erro: "Data de prazo inválida.", ...valores });
        }

        if (idRaw) {
            const tarefa = tarefas.find(
                (t) => t.id === Number(idRaw) && t.dono === usuario,
            );
            if (!tarefa) error(404, "Tarefa não encontrada");

            Object.assign(tarefa, valores);
        } else {
            tarefas.push({ id: novoID(), ...valores, dono: usuario });
        }

        redirect(303, "/painel");
    },
};