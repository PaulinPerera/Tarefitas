import React, { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { corDaTarefa, fonte, sombra, tinta, useTema } from '../tema';

// Bolinha de marcar: o anel tem a cor da tarefita e, ao concluir,
// ela se preenche com um pequeno "pulo".
function Bolinha({ feito, cor, onPress, rotulo }) {
  const anim = useRef(new Animated.Value(feito ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: feito ? 1 : 0,
      friction: 5,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [feito, anim]);

  const escala = anim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] });

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: feito }}
      accessibilityLabel={rotulo}
      style={[estilos.bolinha, { borderColor: cor }]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          estilos.preenchimento,
          { backgroundColor: cor, opacity: anim, transform: [{ scale: escala }] },
        ]}
      >
        <Ionicons name="checkmark" size={18} color={tinta} />
      </Animated.View>
    </Pressable>
  );
}

function ItemTarefa({ item, onAlternar, onRemover }) {
  const { cores, escuro } = useTema();
  const cor = corDaTarefa(item);

  return (
    <View
      style={[
        estilos.cartao,
        { backgroundColor: cores.superficie, borderColor: cores.borda },
        sombra(cores, escuro),
      ]}
    >
      <View style={[estilos.aba, { backgroundColor: cor }]} />

      <Bolinha
        feito={item.feito}
        cor={cor}
        onPress={() => onAlternar(item.id)}
        rotulo={item.feito ? 'Marcar como pendente' : 'Marcar como concluída'}
      />

      <Pressable style={estilos.areaTitulo} onPress={() => onAlternar(item.id)}>
        <Text
          style={[
            estilos.titulo,
            { color: item.feito ? cores.suave : cores.texto },
            item.feito && estilos.tituloFeito,
          ]}
        >
          {item.titulo}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onRemover(item.id)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Apagar tarefa: ${item.titulo}`}
        style={({ pressed }) => [
          estilos.apagar,
          { backgroundColor: cores.perigoSuave },
          pressed && { opacity: 0.7, transform: [{ scale: 0.92 }] },
        ]}
      >
        <Ionicons name="trash-outline" size={20} color={cores.perigo} />
      </Pressable>
    </View>
  );
}

export default memo(ItemTarefa);

const estilos = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    borderRadius: 22,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingLeft: 20,
    paddingRight: 12,
  },
  aba: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  bolinha: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
    marginRight: 14,
  },
  preenchimento: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaTitulo: { flex: 1, paddingVertical: 4, marginRight: 10 },
  titulo: { fontFamily: fonte.negrito, fontSize: 16, lineHeight: 22 },
  tituloFeito: { textDecorationLine: 'line-through' },
  apagar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
