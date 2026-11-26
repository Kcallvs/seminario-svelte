export const PRIORIDADES = [
	{ id: "baixa", nome: "Baixa" },
	{ id: "media", nome: "Média" },
	{ id: "alta", nome: "Alta" }
];

export const PESO = { alta: 3, media: 2, baixa: 1 };

/** Tarefas antigas, sem prioridade, contam como "média". */
export function prioridadeDe(t) {
	return t?.prioridade in PESO ? t.prioridade : "media";
}

export function nomePrioridade(id) {
	return PRIORIDADES.find((p) => p.id === id)?.nome ?? "Média";
}

export function hojeISO() {
	const d = new Date();
	const mes = String(d.getMonth() + 1).padStart(2, "0");
	const dia = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${mes}-${dia}`;
}

export function prazoValido(texto) {
    if (typeof texto !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
        return false;
    }

    const [ano, mes, dia] = texto.split("-").map(Number);

    if (ano < 1 || mes < 1 || mes > 12) {
        return false;
    }

    const bissexto = ano % 400 === 0 || (ano % 4 === 0 && ano % 100 !== 0);

    const diasPorMes = [
        31,
        bissexto ? 29 : 28,
        31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
    ];

    return dia >= 1 && dia <= diasPorMes[mes - 1];
}

/** "2026-10-12" vira "12/10/2026" */
export function formatarPrazo(texto) {
	if (!texto) return "";
	const [ano, mes, dia] = texto.split("-");
	return `${dia}/${mes}/${ano}`;
}

/** @returns {"atrasada" | "hoje" | null} */
export function situacaoPrazo(t) {
	if (!t.prazo || t.concluida) return null;
	const hoje = hojeISO();
	if (t.prazo < hoje) return "atrasada";
	if (t.prazo === hoje) return "hoje";
	return null;
}

