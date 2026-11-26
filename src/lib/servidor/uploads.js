import path from "node:path";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export const PASTA_UPLOADS = path.resolve("uploads");

export const TIPOS = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif"
};

export const TAMANHO_MAX = 2 * 1024 * 1024;

export async function salvarArquivo(arquivo) {
    const nome = randomUUID() + TIPOS[arquivo.type];

    await mkdir(PASTA_UPLOADS, { recursive: true });

    await writeFile(
        path.join(PASTA_UPLOADS, nome),
        Buffer.from(await arquivo.arrayBuffer())
    );

    return `/uploads/${nome}`;
}

export async function apagarArquivo(caminho) {
    if (!caminho) return;

    await unlink(
        path.join(PASTA_UPLOADS, path.basename(caminho))
    ).catch(() => {});
}