
export function load({ cookies }) {
	return {
		logado: Boolean(cookies.get("sessao")),
	};
}