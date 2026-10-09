import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listaDoces } from './tema';
import { chaveTarefas } from './contas';
import { useUsuario } from './usuario';

const TAREFAS_INICIAIS = [
  { id: 'exemplo-1', titulo: 'Toque no círculo para concluir uma tarefita', feito: false, cor: 0 },
  { id: 'exemplo-2', titulo: 'Toque na lixeira para apagar', feito: false, cor: 1 },
];

const TarefasContext = createContext(null);

// As tarefas pertencem à CONTA ATIVA. Quando a conta muda, a lista da conta
// anterior é guardada e a lista da nova conta é carregada.
export function TarefasProvider({ children }) {
  const { usuario } = useUsuario();
  const contaId = usuario ? usuario.id : null;

  // `id` diz de qual conta é a lista; `pronto` só vira true depois de ler do AsyncStorage.
  const [dados, setDados] = useState({ id: null, lista: [], pronto: false });

  // Lê as tarefas da conta ativa sempre que a conta muda.
  useEffect(() => {
    if (!contaId) {
      setDados({ id: null, lista: [], pronto: false });
      return undefined;
    }
    let ativo = true;
    setDados({ id: contaId, lista: [], pronto: false });
    (async () => {
      let lidas = TAREFAS_INICIAIS;
      try {
        const salvo = await AsyncStorage.getItem(chaveTarefas(contaId));
        if (salvo !== null) {
          const lista = JSON.parse(salvo);
          if (Array.isArray(lista)) lidas = lista;
        }
      } catch (erro) {
        // se der erro na leitura, começa com os exemplos
      }
      if (ativo) setDados({ id: contaId, lista: lidas, pronto: true });
    })();
    return () => {
      ativo = false;
    };
  }, [contaId]);

  // Salva na chave da conta dona da lista (só depois da leitura, para nunca
  // sobrescrever as tarefas salvas com uma lista vazia nem misturar contas).
  useEffect(() => {
    if (!dados.pronto || !dados.id) return;
    AsyncStorage.setItem(chaveTarefas(dados.id), JSON.stringify(dados.lista)).catch(() => {});
  }, [dados]);

  const mudar = useCallback((fn) => {
    setDados((a) => (a.pronto ? { ...a, lista: fn(a.lista) } : a));
  }, []);

  const adicionar = useCallback(
    (titulo) => {
      const limpo = titulo.trim();
      if (limpo === '') return false;
      mudar((atual) => {
        const primeira = atual[0];
        const cor = primeira ? ((primeira.cor ?? 0) + 1) % listaDoces.length : 0;
        const nova = {
          id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`, // identificador único
          titulo: limpo, // o texto digitado
          feito: false,
          cor,
        };
        return [nova, ...atual]; // a mais nova aparece no topo, logo abaixo do campo
      });
      return true;
    },
    [mudar]
  );

  const alternar = useCallback(
    (id) => mudar((atual) => atual.map((t) => (t.id === id ? { ...t, feito: !t.feito } : t))),
    [mudar]
  );

  const remover = useCallback((id) => mudar((atual) => atual.filter((t) => t.id !== id)), [mudar]);

  const valor = useMemo(() => {
    const tarefas = dados.lista;
    const total = tarefas.length;
    const feitas = tarefas.filter((t) => t.feito).length;
    return {
      tarefas,
      total,
      feitas,
      pendentes: total - feitas,
      carregado: dados.pronto,
      adicionar,
      alternar,
      remover,
    };
  }, [dados, adicionar, alternar, remover]);

  return <TarefasContext.Provider value={valor}>{children}</TarefasContext.Provider>;
}

export function useTarefas() {
  return useContext(TarefasContext);
}
