import { redirect, fail } from "@sveltejs/kit";

// ⚠️ TEMPORÁRIO: guarda os usuários na memória do servidor, só para testar.
// Some tudo quando o servidor reinicia. Troque pelo seu backend/banco.
const usuarios = new Map();

export const actions = {
  login: async ({ request, cookies }) => {
    const dados = await request.formData();
    const usuario = dados.get("usuario")?.toString().trim() ?? "";
    const senha = dados.get("senha")?.toString() ?? "";

    const ehAdminFixo = usuario === "admin" && senha === "1234";
    const ehCadastrado = usuarios.get(usuario)?.senha === senha;

    if (!ehAdminFixo && !ehCadastrado) {
      return fail(401, {
        modo: "login",
        erro: "Usuário ou senha inválidos.",
        usuario,
      });
    }

    cookies.set("sessao", "ativa", { path: "/", httpOnly: true });

    throw redirect(303, "/painel");
  },

  cadastro: async ({ request }) => {
    const dados = await request.formData();
    const nome = dados.get("nome")?.toString().trim() ?? "";
    const usuario = dados.get("usuario")?.toString().trim() ?? "";
    const senha = dados.get("senha")?.toString() ?? "";
    const confirmar = dados.get("confirmar")?.toString() ?? "";

    if (senha.length < 6) {
      return fail(400, {
        modo: "cadastro",
        erro: "A senha precisa ter pelo menos 6 caracteres.",
        nome,
        usuario,
      });
    }

    if (senha !== confirmar) {
      return fail(400, {
        modo: "cadastro",
        erro: "As senhas não conferem.",
        nome,
        usuario,
      });
    }

    if (usuario === "admin" || usuarios.has(usuario)) {
      return fail(400, {
        modo: "cadastro",
        erro: "Esse usuário já existe.",
        nome,
        usuario,
      });
    }

    usuarios.set(usuario, { nome, senha });

    return {
      modo: "login",
      sucesso: "Conta criada! Faça login para continuar.",
      usuario,
    };
  },
};