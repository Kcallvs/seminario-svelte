import { json } from "@sveltejs/kit";
import { tarefas } from "$lib/servidor/dados.js";
import { PRIORIDADES, prazoValido } from "$lib/tarefas.js";
import {
    TIPOS,
    TAMANHO_MAX,
    salvarArquivo,
    apagarArquivo
} from "$lib/servidor/uploads.js";

function encontrarTarefa(id, usuario) {
    return tarefas.findIndex(
        (t) => t.id === Number(id) && t.dono === usuario
    );
}

export function GET({ params, cookies }) {
    const usuario = cookies.get("sessao");

    if (!usuario) {
        return json({ erro: "Não autenticado." }, { status: 401 });
    }

    const i = encontrarTarefa(params.id, usuario);

    if (i === -1) {
        return json({ erro: "Tarefa não encontrada." }, { status: 404 });
    }

    return json(tarefas[i]);
}

export async function PUT({ params, request, cookies }) {
    const usuario = cookies.get("sessao");

    if (!usuario) {
        return json({ erro: "Não autenticado." }, { status: 401 });
    }

    const i = encontrarTarefa(params.id, usuario);

    if (i === -1) {
        return json({ erro: "Tarefa não encontrada." }, { status: 404 });
    }

    try {
        const atual = tarefas[i];
        const tipoConteudo = request.headers.get("content-type") ?? "";

        let dados;
        let arquivo = null;
        let removerImagem = false;
        let formulario = false;

        if (tipoConteudo.includes("multipart/form-data")) {
            formulario = true;

            const form = await request.formData();

            dados = {
                titulo: form.get("titulo")?.toString().trim() ?? "",
                descricao: form.get("descricao")?.toString().trim() ?? "",
                prazo: form.get("prazo")?.toString() ?? "",
                prioridade: form.get("prioridade")?.toString() ?? "media",
                concluida: form.get("concluida") === "on"
            };

            arquivo = form.get("imagem");
            removerImagem = form.get("removerImagem") === "on";
        } else {
            dados = await request.json();
        }

        if (formulario || dados.titulo !== undefined) {
            if (typeof dados.titulo !== "string" || dados.titulo.trim().length < 3) {
                return json(
                    { erro: "O título precisa ter pelo menos 3 caracteres." },
                    { status: 400 }
                );
            }
        }

        if (formulario || dados.descricao !== undefined) {
            if (typeof dados.descricao !== "string" || dados.descricao.length > 500) {
                return json(
                    { erro: "A descrição pode ter no máximo 500 caracteres." },
                    { status: 400 }
                );
            }
        }

        if (formulario || dados.prazo !== undefined) {
            if (dados.prazo && !prazoValido(dados.prazo)) {
                return json(
                    { erro: "Data de prazo inválida." },
                    { status: 400 }
                );
            }
        }

        if (
            dados.prioridade !== undefined &&
            !PRIORIDADES.some((p) => p.id === dados.prioridade)
        ) {
            return json(
                { erro: "Prioridade inválida." },
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

        const atualizada = {
            ...atual,
            ...(dados.titulo !== undefined && { titulo: dados.titulo.trim() }),
            ...(dados.descricao !== undefined && { descricao: dados.descricao }),
            ...(dados.prazo !== undefined && { prazo: dados.prazo }),
            ...(dados.prioridade !== undefined && { prioridade: dados.prioridade }),
            ...(typeof dados.concluida === "boolean" && {
                concluida: dados.concluida
            })
        };

        if (temArquivo) {
            const novaImagem = await salvarArquivo(arquivo);
            await apagarArquivo(atual.imagem);
            atualizada.imagem = novaImagem;
        } else if (removerImagem) {
            await apagarArquivo(atual.imagem);
            atualizada.imagem = null;
        }

        tarefas[i] = atualizada;

        return json(atualizada);

    } catch (erro) {
        console.error(erro);

        return json(
            { erro: "Não foi possível atualizar a tarefa." },
            { status: 500 }
        );
    }
}

export async function DELETE({ params, cookies }) {
    const usuario = cookies.get("sessao");

    if (!usuario) {
        return json({ erro: "Não autenticado." }, { status: 401 });
    }

    const i = encontrarTarefa(params.id, usuario);

    if (i === -1) {
        return json({ erro: "Tarefa não encontrada." }, { status: 404 });
    }

    await apagarArquivo(tarefas[i].imagem);
    tarefas.splice(i, 1);

    return new Response(null, { status: 204 });
}