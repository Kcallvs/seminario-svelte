/**
 * @typedef {Object} Tarefa
 * @property {number} id
 * @property {string} titulo
 * @property {string} descricao
 * @property {string} prazo        data no formato AAAA-MM-DD, ou "" se não tiver
 * @property {"baixa" | "media" | "alta"} prioridade
 * @property {boolean} concluida
 * @property {string} dono
 */

/** @type {Tarefa[]} */
export const tarefas = [];

let proximoID = 1;

export const novoID = () => proximoID++;