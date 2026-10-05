import { redirect, fail } from "@sveltejs/kit";

export const actions = {
	default: async ({ request, cookies }) => {
		const dados = await request.formData();
		const usuario = dados.get("usuario");
		const senha = dados.get("senha");

		if (usuario !== "admin" || senha !== "1234") {
			return fail(401, { erro: "Usuário ou senha inválidos.", usuario });
		}

		cookies.set("sessao", "ativa", { path: "/", httpOnly: true });

		throw redirect(303, "/painel");
	}
};