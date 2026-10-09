import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonte, useTema } from '../tema';
import ListaContas from './ListaContas';

// Folhinha "Trocar de conta" que sobe de baixo (usada na tela de Tarefas).
export default function MenuContas({ visivel, onFechar, onNova }) {
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
          <Text style={[estilos.titulo, { color: cores.texto }]}>Trocar de conta</Text>
          <Text style={[estilos.legenda, { color: cores.suave }]}>Cada conta tem a sua própria lista de tarefas.</Text>
          <ScrollView style={estilos.rolagem} showsVerticalScrollIndicator={false}>
            <ListaContas onEscolher={onFechar} onNova={onNova} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(18,17,41,0.55)', justifyContent: 'flex-end' },
  folha: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 20, paddingTop: 12, maxHeight: '80%' },
  alca: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, marginBottom: 14 },
  titulo: { fontFamily: fonte.preta, fontSize: 20 },
  legenda: { fontFamily: fonte.media, fontSize: 13, marginTop: 2, marginBottom: 14 },
  rolagem: { flexGrow: 0 },
});
