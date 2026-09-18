import { redirect } from "@sveltejs/kit";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const inicio = Date.now();
	console.log(`→ ${event.request.method} ${event.url.pathname}`);

	// 1. Middleware protegendo a rota /painel: sem o cookie de sessão
	//    (criado no login), redireciona antes mesmo de a página carregar.
	if (event.url.pathname.startsWith("/painel")) {
		const sessao = event.cookies.get("sessao");
		if (!sessao) {
			throw redirect(303, "/login");
		}
	}

	// 2. Segue para a rota normalmente
	const response = await resolve(event);

	// 3. Reforça HTTPS no navegador via cabeçalho HSTS
	response.headers.set(
		"Strict-Transport-Security",
		"max-age=63072000; includeSubDomains"
	);

	console.log(`← ${event.url.pathname} em ${Date.now() - inicio}ms`);
	return response;
}
