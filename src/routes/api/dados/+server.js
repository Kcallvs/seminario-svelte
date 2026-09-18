import { json } from "@sveltejs/kit";

// Endpoint de exemplo: GET /api/dados
// Em produção, isso roda atrás do middleware definido em hooks.server.js,
// então já chega aqui depois da checagem feita no handle().
export function GET() {
	const pedidos = [
		{ cliente: "Ana", status: "em preparo" },
		{ cliente: "Bruno", status: "entregue" },
		{ cliente: "Carla", status: "em preparo" }
	];

	return json(pedidos);
}
