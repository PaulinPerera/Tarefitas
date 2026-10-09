import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doces, fonte, useTema } from '../tema';

// Mostrado quando não há nenhuma tarefa na lista.
export default function EstadoVazio() {
  const { cores } = useTema();
  return (
    <View style={estilos.caixa}>
      <View style={estilos.bolha}>
        <Ionicons name="sparkles" size={34} color={doces.lilas} />
      </View>
      <Text style={[estilos.titulo, { color: cores.texto }]}>Nenhuma tarefita por aqui</Text>
      <Text style={[estilos.texto, { color: cores.suave }]}>
        Digite algo no campo acima e toque em + para criar a primeira.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 32 },
  bolha: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(183,161,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  titulo: { fontFamily: fonte.forte, fontSize: 19, marginBottom: 6 },
  texto: { fontFamily: fonte.media, fontSize: 15, lineHeight: 21, textAlign: 'center' },
});
