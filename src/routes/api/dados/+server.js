import { json } from "@sveltejs/kit";
import { tarefas, novoID } from "$lib/servidor/dados.js";
import { PRIORIDADES, prazoValido } from "$lib/tarefas.js";
import { TIPOS, TAMANHO_MAX, salvarArquivo } from "$lib/servidor/uploads.js";

export function GET({ cookies }) {
    const usuario = cookies.get("sessao");

    if (!usuario) {
        return json({ erro: "Não autenticado." }, { status: 401 });
    }

    const lista = tarefas.filter((t) => t.dono === usuario);

    return json(lista);
}

export async function POST({ request, cookies }) {
    const usuario = cookies.get("sessao");

    if (!usuario) {
        return json({ erro: "Não autenticado." }, { status: 401 });
    }

    try {
        const form = await request.formData();

        const titulo = form.get("titulo")?.toString().trim() ?? "";
        const descricao = form.get("descricao")?.toString().trim() ?? "";
        const prazo = form.get("prazo")?.toString() ?? "";
        const prioridadeRaw = form.get("prioridade")?.toString() ?? "media";
        const prioridade = PRIORIDADES.some((p) => p.id === prioridadeRaw)
            ? prioridadeRaw
            : "media";
        const concluida = form.get("concluida") === "on";
        const arquivo = form.get("imagem");

        if (titulo.length < 3) {
            return json(
                { erro: "O título precisa ter pelo menos 3 caracteres." },
                { status: 400 }
            );
        }

        if (descricao.length > 500) {
            return json(
                { erro: "A descrição pode ter no máximo 500 caracteres." },
                { status: 400 }
            );
        }

        if (prazo && !prazoValido(prazo)) {
            return json(
                { erro: "Data de prazo inválida." },
                { status: 400 }
            );
        }

        const temArquivo = arquivo instanceof File && arquivo.size > 0;

        if (temArquivo && !TIPOS[arquivo.type]) {
            return json(
                { erro: "Envie uma imagem PNG, JPG, WEBP ou GIF." },
                { status: 400 }
            );
        }

        if (temArquivo && arquivo.size > TAMANHO_MAX) {
            return json(
                { erro: "A imagem pode ter no máximo 2 MB." },
                { status: 400 }
            );
        }

        const imagem = temArquivo ? await salvarArquivo(arquivo) : null;

        const nova = {
            id: novoID(),
            titulo,
            descricao,
            prazo,
            prioridade,
            concluida,
            imagem,
            dono: usuario
        };

        tarefas.push(nova);

        return json(nova, { status: 201 });

    } catch (erro) {
        console.error(erro);

        return json(
            { erro: "Não foi possível criar a tarefa." },
            { status: 500 }
        );
    }
}