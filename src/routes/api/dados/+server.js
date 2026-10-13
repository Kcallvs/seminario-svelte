import { json } from "@sveltejs/kit";
import {tarefas,novoID} from '$lib/servidor/dados';

export async function GET() {
	return json(tarefas);
}

export async function POST({ request }) {
	const dados = await request.json();
  
	if (!dados.titulo || typeof dados.titulo !== 'string') {
	  return json({ erro: 'titulo é obrigatório' }, { status: 400 });
	}
  
	/** @type {import('$lib/servidor/dados').Tarefa} */
	const nova = {
	  id: novoID(),
	  titulo: dados.titulo,
	  descricao: dados.descricao ?? '',
	  prazo: dados.prazo ?? '',
	  prioridade: ['baixa', 'media', 'alta'].includes(dados.prioridade) ? dados.prioridade : 'media',
	  concluida: false,
	  dono: dados.dono ?? ''
	};
  
	tarefas.push(nova);
	return json(nova, { status: 201 });
  }