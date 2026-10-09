import AsyncStorage from '@react-native-async-storage/async-storage';

// Como os dados ficam no AsyncStorage:
//   @tarefitas:contas           -> lista de contas [{ id, nome, email, foto, criadoEm }]
//   @tarefitas:contaAtiva       -> id da conta que está em uso
//   @tarefitas:tarefas:<id>     -> tarefas de CADA conta (uma chave por conta)
export const CHAVE_CONTAS = '@tarefitas:contas';
export const CHAVE_ATIVA = '@tarefitas:contaAtiva';
export const PREFIXO_TAREFAS = '@tarefitas:tarefas:';

// Chaves da versão anterior (uma conta só). Usadas só para migrar.
const ANTIGA_USUARIO = '@tarefitas:usuario';
const ANTIGA_TAREFAS = '@tarefitas:tarefas';

export const chaveTarefas = (id) => `${PREFIXO_TAREFAS}${id}`;

export function novoId() {
  return `c${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

const contaValida = (c) =>
  c && typeof c.id === 'string' && typeof c.nome === 'string' && typeof c.email === 'string';

// Move as tarefas da versão antiga (lista única) para dentro de uma conta.
export async function adotarTarefasAntigas(id) {
  try {
    const antigas = await AsyncStorage.getItem(ANTIGA_TAREFAS);
    if (antigas !== null) {
      await AsyncStorage.setItem(chaveTarefas(id), antigas);
      await AsyncStorage.removeItem(ANTIGA_TAREFAS);
    }
  } catch (erro) {
    // sem problema: a conta só começa sem essas tarefas
  }
}

export async function gravarContas(contas, ativaId) {
  await AsyncStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));
  if (ativaId) await AsyncStorage.setItem(CHAVE_ATIVA, ativaId);
  else await AsyncStorage.removeItem(CHAVE_ATIVA);
}

export async function apagarTarefasDaConta(id) {
  try {
    await AsyncStorage.removeItem(chaveTarefas(id));
  } catch (erro) {
    // ignora
  }
}

// Lê as contas salvas. Se encontrar dados da versão antiga, migra para o formato novo.
export async function carregarContas() {
  let contas = [];
  let ativaId = null;

  try {
    const salvo = await AsyncStorage.getItem(CHAVE_CONTAS);
    if (salvo !== null) {
      const lista = JSON.parse(salvo);
      if (Array.isArray(lista)) contas = lista.filter(contaValida);
    }
    ativaId = await AsyncStorage.getItem(CHAVE_ATIVA);
  } catch (erro) {
    // dado corrompido: começa sem contas
  }

  if (contas.length === 0) {
    try {
      const antigo = await AsyncStorage.getItem(ANTIGA_USUARIO);
      if (antigo !== null) {
        const o = JSON.parse(antigo);
        if (o && typeof o.nome === 'string' && typeof o.email === 'string') {
          const conta = {
            id: novoId(),
            nome: o.nome,
            email: o.email,
            foto: o.foto ?? null,
            criadoEm: o.criadoEm ?? Date.now(),
          };
          await adotarTarefasAntigas(conta.id);
          contas = [conta];
          ativaId = conta.id;
          await gravarContas(contas, ativaId);
        }
        await AsyncStorage.removeItem(ANTIGA_USUARIO);
      }
    } catch (erro) {
      // ignora: segue sem migrar
    }
  }

  if (!contas.some((c) => c.id === ativaId)) ativaId = contas[0] ? contas[0].id : null;
  return { contas, ativaId };
}
