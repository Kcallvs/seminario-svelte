export const actions = {
	sair: async ({ cookies }) => {
		cookies.delete("sessao", { path: "/" });
	}
};
