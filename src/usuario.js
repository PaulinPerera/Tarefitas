import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { apagarFoto } from './fotos';
import {
  adotarTarefasAntigas,
  apagarTarefasDaConta,
  carregarContas,
  gravarContas,
  novoId,
} from './contas';

const UsuarioContext = createContext(null);

// Guarda TODAS as contas do aparelho e qual delas está ativa.
// `usuario` é a conta ativa (null = ainda não existe nenhuma -> tela de Cadastro).
export function UsuarioProvider({ children }) {
  const [contas, setContas] = useState([]);
  const [ativaId, setAtivaId] = useState(null);
  const [carregado, setCarregado] = useState(false);

  // Cópias sempre atualizadas para as funções abaixo não lerem valor velho.
  const contasRef = useRef(contas);
  const ativaRef = useRef(ativaId);
  contasRef.current = contas;
  ativaRef.current = ativaId;

  useEffect(() => {
    let ativo = true;
    (async () => {
      const lido = await carregarContas();
      if (ativo) {
        setContas(lido.contas);
        setAtivaId(lido.ativaId);
        setCarregado(true);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const aplicar = useCallback(async (novasContas, novoAtivo) => {
    await gravarContas(novasContas, novoAtivo);
    setContas(novasContas);
    setAtivaId(novoAtivo);
  }, []);

  // Cria uma conta nova e já passa a usá-la.
  const criarConta = useCallback(
    async ({ nome, email, foto }) => {
      const nova = { id: novoId(), nome, email, foto: foto ?? null, criadoEm: Date.now() };
      // Primeira conta do app: herda tarefas antigas (de versões sem contas), se existirem.
      if (contasRef.current.length === 0) await adotarTarefasAntigas(nova.id);
      await aplicar([...contasRef.current, nova], nova.id);
    },
    [aplicar]
  );

  // Edita a conta ativa (nome, e-mail, foto).
  const salvar = useCallback(
    async ({ nome, email, foto }) => {
      const id = ativaRef.current;
      const atual = contasRef.current.find((c) => c.id === id);
      if (!atual) return;
      const editada = { ...atual, nome, email, foto: foto ?? null };
      await aplicar(
        contasRef.current.map((c) => (c.id === id ? editada : c)),
        id
      );
      if (atual.foto && atual.foto !== editada.foto) apagarFoto(atual.foto);
    },
    [aplicar]
  );

  const trocarConta = useCallback(
    async (id) => {
      if (id === ativaRef.current) return;
      if (!contasRef.current.some((c) => c.id === id)) return;
      await aplicar(contasRef.current, id);
    },
    [aplicar]
  );

  // Remove a conta, as tarefas dela e a foto. Se era a ativa, passa para outra
  // (ou volta ao Cadastro se não sobrar nenhuma).
  const removerConta = useCallback(
    async (id) => {
      const conta = contasRef.current.find((c) => c.id === id);
      if (!conta) return;
      const restantes = contasRef.current.filter((c) => c.id !== id);
      const novoAtivo = id === ativaRef.current ? (restantes[0] ? restantes[0].id : null) : ativaRef.current;
      await apagarTarefasDaConta(id);
      await aplicar(restantes, novoAtivo);
      apagarFoto(conta.foto);
    },
    [aplicar]
  );

  const usuario = useMemo(() => contas.find((c) => c.id === ativaId) ?? null, [contas, ativaId]);

  const valor = useMemo(
    () => ({ usuario, contas, carregado, criarConta, salvar, trocarConta, removerConta }),
    [usuario, contas, carregado, criarConta, salvar, trocarConta, removerConta]
  );

  return <UsuarioContext.Provider value={valor}>{children}</UsuarioContext.Provider>;
}

export function useUsuario() {
  return useContext(UsuarioContext);
}
