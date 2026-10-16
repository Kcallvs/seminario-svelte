import { error } from "@sveltejs/kit";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PASTA_UPLOADS, TIPOS } from "$lib/servidor/uploads.js";

const MIME = Object.fromEntries(Object.entries(TIPOS).map(([mime, ext]) => [ext, mime]));

export async function GET({ params }) {
	const nome = path.basename(params.nome);
	const tipo = MIME[path.extname(nome)];
	if (!tipo) error(404, "Não encontrado");

	try {
		const dados = await readFile(path.join(PASTA_UPLOADS, nome));
		return new Response(dados, {
			headers: {
				"Content-Type": tipo,
				"Cache-Control": "public, max-age=31536000, immutable"
			}
		});
	} catch {
		error(404, "Não encontrado");
	}
}