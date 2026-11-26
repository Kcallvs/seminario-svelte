
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

        const tituloRaw = form.get("titulo");
        const descricaoRaw = form.get("descricao");
        const prazoRaw = form.get("prazo");
        const prioridadeRaw = form.get("prioridade");
        const concluidaRaw = form.get("concluida");
        const arquivo = form.get("imagem");

        if (typeof tituloRaw !== "string" || typeof descricaoRaw !== "string") {
            return json(
                { erro: "Título e descrição devem ser textos." },
                { status: 400 }
            );
        }

        const titulo = tituloRaw.trim();
        const descricao = descricaoRaw.trim();

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

        if (prazoRaw !== null && typeof prazoRaw !== "string") {
            return json(
                { erro: "O prazo deve ser um texto." },
                { status: 400 }
            );
        }

        const prazo = prazoRaw ?? "";

        if (prazo && !prazoValido(prazo)) {
            return json(
                { erro: "Data de prazo inválida." },
                { status: 400 }
            );
        }

        const prioridade = prioridadeRaw ?? "media";

        if (
            typeof prioridade !== "string" ||
            !PRIORIDADES.some((p) => p.id === prioridade)
        ) {
            return json(
                { erro: "Prioridade inválida." },
                { status: 400 }
            );
        }

        if (concluidaRaw !== null && concluidaRaw !== "on") {
            return json(
                { erro: "Valor de conclusão inválido." },
                { status: 400 }
            );
        }

        const concluida = concluidaRaw === "on";

        if (arquivo !== null && !(arquivo instanceof File)) {
            return json(
                { erro: "Arquivo de imagem inválido." },
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
