import { json } from "@sveltejs/kit";
import {tarefas} from '$lib/servidor/dados';


function find(param){
    return tarefas.findIndex((t)=> t.id === Number(param.id))
}


export async function GET({ params }) {
    const i = find(params);
    if (i === -1) return json({ erro: 'N/A' }, { status: 404 });
    return json(tarefas[i]);
}

export async function PUT({ params, request }) {
    const i = find(params);
    if (i === -1) return json({ erro: 'N/A' }, { status: 404 });
  
    const dados = await request.json();
    const atual = tarefas[i];
  
    tarefas[i] = {
      ...atual,
      titulo: dados.titulo ?? atual.titulo,
      descricao: dados.descricao ?? atual.descricao,
      prazo: dados.prazo ?? atual.prazo,
      prioridade: ['baixa', 'media', 'alta'].includes(dados.prioridade)
        ? dados.prioridade
        : atual.prioridade,
      concluida: typeof dados.concluida === 'boolean' ? dados.concluida : atual.concluida,
      dono: dados.dono ?? atual.dono
    };
  
    return json(tarefas[i]);
  }
  
  export async function DELETE({ params }) {
    const i = find(params);
    if (i === -1) return json({ erro: 'N/A' }, { status: 404 });
    tarefas.splice(i, 1);
    return new Response(null, { status: 204 });
  }