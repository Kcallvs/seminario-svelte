import { redirect, fail } from "@sveltejs/kit";

// Form action: roda no servidor quando o formulário é enviado.
// Usuário/senha fixos só para a demonstração.
export const actions = {
	default: async ({ request, cookies }) => {
		const dados = await request.formData();
		const usuario = dados.get("usuario");
		const senha = dados.get("senha");

		if (usuario !== "admin" || senha !== "1234") {
			return fail(401, { erro: "Usuário ou senha inválidos." });
		}

		// Cria a "sessão": um cookie que o middleware vai checar
		// em toda requisição para rotas protegidas (/painel).
		cookies.set("sessao", "ativa", { path: "/", httpOnly: true });

		throw redirect(303, "/painel");
	}
};
