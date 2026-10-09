import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { doces, fonte, tinta, useTema } from '../tema';

function Opcao({ icone, texto, onPress, perigo }) {
  const { cores } = useTema();
  const cor = perigo ? cores.perigo : cores.texto;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [estilos.opcao, pressed && { opacity: 0.6 }]}
    >
      <View style={[estilos.icone, { backgroundColor: perigo ? cores.perigoSuave : doces.lilas }]}>
        <Ionicons name={icone} size={20} color={perigo ? cores.perigo : tinta} />
      </View>
      <Text style={[estilos.texto, { color: cor }]}>{texto}</Text>
    </Pressable>
  );
}

// Folhinha que sobe de baixo com as opções para a foto de perfil.
export default function MenuFoto({ visivel, temFoto, onGaleria, onCamera, onRemover, onFechar }) {
  const { cores } = useTema();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar} statusBarTranslucent>
      <Pressable style={estilos.fundo} onPress={onFechar}>
        <Pressable
          style={[estilos.folha, { backgroundColor: cores.superficie, paddingBottom: insets.bottom + 16 }]}
          onPress={() => {}}
        >
          <View style={[estilos.alca, { backgroundColor: cores.borda }]} />
          <Text style={[estilos.titulo, { color: cores.texto }]}>Foto de perfil</Text>
          <Opcao icone="image-outline" texto="Escolher da galeria" onPress={onGaleria} />
          <Opcao icone="camera-outline" texto="Tirar uma foto" onPress={onCamera} />
          {temFoto && <Opcao icone="trash-outline" texto="Remover foto" onPress={onRemover} perigo />}
          <Pressable
            onPress={onFechar}
            accessibilityRole="button"
            style={({ pressed }) => [estilos.cancelar, { backgroundColor: cores.fundo }, pressed && { opacity: 0.7 }]}
          >
            <Text style={[estilos.cancelarTexto, { color: cores.suave }]}>Cancelar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(18,17,41,0.55)', justifyContent: 'flex-end' },
  folha: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 22, paddingTop: 12 },
  alca: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, marginBottom: 14 },
  titulo: { fontFamily: fonte.preta, fontSize: 20, marginBottom: 8 },
  opcao: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  icone: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  texto: { fontFamily: fonte.negrito, fontSize: 16 },
  cancelar: { marginTop: 10, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cancelarTexto: { fontFamily: fonte.forte, fontSize: 16 },
});
