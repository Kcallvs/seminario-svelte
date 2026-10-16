import path from "node:path";
import { unlink } from "node:fs/promises";

export const PASTA_UPLOADS = path.resolve("uploads");

export const TIPOS = {
	"image/jpeg": ".jpg",
	"image/png": ".png",
	"image/webp": ".webp",
	"image/gif": ".gif"
};

export const TAMANHO_MAX = 2 * 1024 * 1024; // 2 MB

/** @param {string | null | undefined} caminho */
export async function apagarArquivo(caminho) {
	if (!caminho) return;
	await unlink(path.join(PASTA_UPLOADS, path.basename(caminho))).catch(() => {});
}