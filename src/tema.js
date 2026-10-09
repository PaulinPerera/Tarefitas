import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_TEMA = '@tarefitas:tema';

// Nunito: redonda e simpática, combina com o nome "Tarefitas".
export const fonte = {
  regular: 'Nunito_400Regular',
  media: 'Nunito_600SemiBold',
  negrito: 'Nunito_700Bold',
  forte: 'Nunito_800ExtraBold',
  preta: 'Nunito_900Black',
};

// Cores "doces": cada tarefita ganha uma delas (barra lateral, bolinha e
// segmento do progresso). Elas são iguais nos dois temas.
export const doces = {
  rosa: '#FF8FB1',
  sol: '#FFC857',
  menta: '#6EDBB0',
  ceu: '#78C2FF',
  lilas: '#B7A1FF',
};
export const listaDoces = Object.values(doces);

// Cor do texto e dos ícones que ficam em cima de uma cor doce.
export const tinta = '#25235C';

export function corDaTarefa(tarefa) {
  return listaDoces[(tarefa.cor ?? 0) % listaDoces.length];
}

const paletaClara = {
  fundo: '#F3F4FF',
  cabecalho: '#25235C',
  superficie: '#FFFFFF',
  texto: '#25235C',
  suave: '#7E7DAA',
  borda: '#E2E3F8',
  perigo: '#F0476A',
  perigoSuave: '#FFE8EE',
  sombra: '#25235C',
};

const paletaEscura = {
  fundo: '#121129',
  cabecalho: '#1B1A45',
  superficie: '#1E1D40',
  texto: '#F2F1FF',
  suave: '#9E9CCB',
  borda: '#2E2C5E',
  perigo: '#FF7A93',
  perigoSuave: '#3A2048',
  sombra: '#000000',
};

// Sombra suave que funciona no iOS (shadow*) e no Android (elevation).
export function sombra(cores, escuro, nivel = 1) {
  return {
    shadowColor: cores.sombra,
    shadowOpacity: escuro ? 0.45 : 0.12,
    shadowRadius: 10 * nivel,
    shadowOffset: { width: 0, height: 5 * nivel },
    elevation: 3 * nivel,
  };
}

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const sistema = useColorScheme();
  const [escolhido, setEscolhido] = useState(null); // 'claro' | 'escuro' | null (segue o sistema)

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_TEMA)
      .then((valor) => {
        if (valor === 'claro' || valor === 'escuro') setEscolhido(valor);
      })
      .catch(() => {});
  }, []);

  const escuro = escolhido ? escolhido === 'escuro' : sistema === 'dark';

  const alternarTema = useCallback(() => {
    const proximo = escuro ? 'claro' : 'escuro';
    setEscolhido(proximo);
    AsyncStorage.setItem(CHAVE_TEMA, proximo).catch(() => {});
  }, [escuro]);

  const valor = useMemo(
    () => ({ cores: escuro ? paletaEscura : paletaClara, escuro, alternarTema }),
    [escuro, alternarTema]
  );

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema() {
  return useContext(TemaContext);
}
