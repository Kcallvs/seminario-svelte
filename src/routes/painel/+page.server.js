
import { tarefas } from "$lib/servidor/dados";


export function load({cookies}){
	const usuario = cookies.get("sessao");
	return {
		tarefas: tarefas.filter((t)=> t.dono == usuario)
	}
}




export const actions = {
	sait: async ({cookies}) => {
		cookies.delete("sessao",{path:"/"});
	}
}