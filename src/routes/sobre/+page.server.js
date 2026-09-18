// Roda no servidor: pega os cabeçalhos que o próprio hooks.server.js
// já vai anexar na resposta desta página.
export function load({ setHeaders }) {
	return {
		explicacao:
			"O cabeçalho Strict-Transport-Security abaixo foi adicionado pelo " +
			"middleware (hooks.server.js), não por esta página."
	};
}
