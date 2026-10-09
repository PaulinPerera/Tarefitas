import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { corDaTarefa, doces, fonte } from '../tema';

const LIMITE_SEGMENTOS = 18;
const VAZIO = 'rgba(255,255,255,0.18)';

// Barra de progresso do cabeçalho: cada tarefita é um segmento e, quando
// concluída, acende com a sua própria cor. Com muitas tarefas, vira uma barra única.
export default function Progresso({ tarefas, total, feitas }) {
  const pct = total > 0 ? Math.round((feitas / total) * 100) : 0;
  const rotulo = total === 0 ? 'Nenhuma tarefita ainda' : `${feitas} de ${total} feitas`;
  const barraUnica = total === 0 || total > LIMITE_SEGMENTOS;

  return (
    <View>
      <View style={estilos.textos}>
        <Text style={estilos.rotulo}>{rotulo}</Text>
        {total > 0 && <Text style={estilos.pct}>{pct}%</Text>}
      </View>
      <View style={[estilos.trilha, barraUnica && estilos.trilhaUnica]}>
        {barraUnica ? (
          <View style={[estilos.preenchido, { width: `${pct}%`, backgroundColor: doces.menta }]} />
        ) : (
          tarefas.map((t) => (
            <View
              key={t.id}
              style={[estilos.segmento, { backgroundColor: t.feito ? corDaTarefa(t) : VAZIO }]}
            />
          ))
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  textos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  rotulo: { fontFamily: fonte.negrito, fontSize: 15, color: '#FFFFFF' },
  pct: { fontFamily: fonte.forte, fontSize: 15, color: 'rgba(255,255,255,0.7)' },
  trilha: {
    flexDirection: 'row',
    height: 12,
    gap: 5,
  },
  trilhaUnica: {
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: VAZIO,
  },
  segmento: { flex: 1, borderRadius: 6 },
  preenchido: { height: '100%', borderRadius: 6 },
});
