import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHAVE_ATIVA, CHAVE_CONTAS, PREFIXO_TAREFAS } from './contas';

const PREFIXO = '@tarefitas:';
const CHAVE_TESTE = '@tarefitas:teste';

// Teste de verdade: grava um valor, lê de volta, compara e apaga.
// Se tudo bater, o AsyncStorage está funcionando.
export async function testarArmazenamento() {
  const inicio = Date.now();
  const valor = `ok-${inicio}-${Math.floor(Math.random() * 100000)}`;
  try {
    await AsyncStorage.setItem(CHAVE_TESTE, valor);
    const lido = await AsyncStorage.getItem(CHAVE_TESTE);
    await AsyncStorage.removeItem(CHAVE_TESTE);
    const sobrou = await AsyncStorage.getItem(CHAVE_TESTE);

    if (lido !== valor) return { ok: false, mensagem: 'O valor lido é diferente do que foi gravado.' };
    if (sobrou !== null) return { ok: false, mensagem: 'Não consegui apagar o valor de teste.' };
    return { ok: true, ms: Date.now() - inicio };
  } catch (erro) {
    return { ok: false, mensagem: String(erro && erro.message ? erro.message : erro) };
  }
}

function lerJson(texto) {
  try {
    return JSON.parse(texto);
  } catch (erro) {
    return null;
  }
}

// Lista o que o app guardou no aparelho (para mostrar na tela).
export async function lerResumo() {
  const todas = await AsyncStorage.getAllKeys();
  const minhas = todas.filter((c) => c.startsWith(PREFIXO));
  const pares = await AsyncStorage.multiGet(minhas);
  const valores = new Map(pares);

  const contas = lerJson(valores.get(CHAVE_CONTAS) ?? '') || [];
  const nomeDe = (id) => {
    const c = Array.isArray(contas) ? contas.find((x) => x.id === id) : null;
    return c ? c.nome : id;
  };

  const itens = pares.map(([chave, valor]) => {
    const texto = valor ?? '';
    let rotulo = chave;
    let detalhe = '';

    if (chave === CHAVE_CONTAS) {
      rotulo = 'Contas cadastradas';
      detalhe = Array.isArray(contas) ? `${contas.length} ${contas.length === 1 ? 'conta' : 'contas'}` : '';
    } else if (chave === CHAVE_ATIVA) {
      rotulo = 'Conta ativa';
      detalhe = nomeDe(texto);
    } else if (chave.startsWith(PREFIXO_TAREFAS)) {
      rotulo = `Tarefas de ${nomeDe(chave.slice(PREFIXO_TAREFAS.length))}`;
      const lista = lerJson(texto);
      if (Array.isArray(lista)) detalhe = `${lista.length} ${lista.length === 1 ? 'tarefa' : 'tarefas'}`;
    } else if (chave === '@tarefitas:tema') {
      rotulo = 'Tema';
      detalhe = texto === 'escuro' ? 'escuro' : 'claro';
    }

    return { chave, rotulo, detalhe, bytes: texto.length };
  });

  // contas e conta ativa primeiro, depois as tarefas, depois o resto
  const peso = (c) => (c === CHAVE_CONTAS ? 0 : c === CHAVE_ATIVA ? 1 : c.startsWith(PREFIXO_TAREFAS) ? 2 : 3);
  return itens.sort((a, b) => peso(a.chave) - peso(b.chave) || a.rotulo.localeCompare(b.rotulo));
}
