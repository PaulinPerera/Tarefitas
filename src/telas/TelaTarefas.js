import React, { useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { doces, fonte, sombra, tinta, useTema } from '../tema';
import { useTarefas } from '../tarefas';
import { useUsuario } from '../usuario';
import { uriDaFoto } from '../fotos';
import Avatar from '../componentes/Avatar';
import MenuContas from '../componentes/MenuContas';
import BotaoIcone from '../componentes/BotaoIcone';
import Progresso from '../componentes/Progresso';
import ItemTarefa from '../componentes/ItemTarefa';
import EstadoVazio from '../componentes/EstadoVazio';

const Separador = () => <View style={{ height: 12 }} />;

// Suaviza a entrada e a saída de itens da lista.
const animar = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

function subtituloDe(total, pendentes) {
  if (total === 0) return 'Sua lista está vazia';
  if (pendentes === 0) return 'Tudo feito, bom descanso!';
  if (pendentes === 1) return 'Falta 1 tarefita';
  return `Faltam ${pendentes} tarefitas`;
}

export default function TelaTarefas({ navigation }) {
  const { cores, escuro, alternarTema } = useTema();
  const { tarefas, total, feitas, pendentes, carregado, adicionar, alternar, remover } = useTarefas();
  const { usuario } = useUsuario();
  const insets = useSafeAreaInsets();

  const [texto, setTexto] = useState('');
  const [focado, setFocado] = useState(false);
  const [menuContas, setMenuContas] = useState(false);
  const primeiroNome = (usuario?.nome ?? '').trim().split(' ')[0];
  const podeAdicionar = texto.trim() !== '';

  const aoAdicionar = () => {
    if (!podeAdicionar) return;
    animar();
    adicionar(texto);
    setTexto('');
  };

  const aoRemover = useCallback(
    (id) => {
      animar();
      remover(id);
    },
    [remover]
  );

  return (
    <View style={[estilos.tela, { backgroundColor: cores.fundo }]}>
      <StatusBar style="light" />

      <View style={[estilos.cabecalho, { backgroundColor: cores.cabecalho, paddingTop: insets.top + 14 }]}>
        <View style={estilos.linhaTopo}>
          <View style={estilos.marcaArea}>
            <Text style={estilos.marca}>Tarefitas</Text>
            <Text style={estilos.subtitulo}>{subtituloDe(total, pendentes)}</Text>
            <Pressable
              onPress={() => setMenuContas(true)}
              accessibilityRole="button"
              accessibilityLabel="Trocar de conta"
              style={({ pressed }) => [estilos.pilula, pressed && { opacity: 0.75 }]}
            >
              <Avatar uri={uriDaFoto(usuario?.foto)} nome={usuario?.nome} tamanho={22} />
              <Text numberOfLines={1} style={estilos.pilulaTexto}>
                {primeiroNome}
              </Text>
              <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.8)" />
            </Pressable>
          </View>
          <View style={estilos.acoes}>
            <BotaoIcone
              nome={escuro ? 'sunny' : 'moon'}
              rotulo={escuro ? 'Ativar tema claro' : 'Ativar tema escuro'}
              onPress={alternarTema}
            />
            <BotaoIcone
              rotulo="Abrir perfil"
              fundo="transparent"
              style={estilos.fotoBotao}
              onPress={() => navigation.navigate('Perfil')}
            >
              <Avatar uri={uriDaFoto(usuario?.foto)} nome={usuario?.nome} tamanho={39} />
            </BotaoIcone>
          </View>
        </View>

        <View style={estilos.progressoArea}>
          <Progresso tarefas={tarefas} total={total} feitas={feitas} />
        </View>
      </View>

      <KeyboardAvoidingView style={estilos.corpo} behavior="padding">
        <View
          style={[
            estilos.entrada,
            { backgroundColor: cores.superficie, borderColor: focado ? doces.lilas : cores.borda },
            sombra(cores, escuro, 1.2),
          ]}
        >
          <TextInput
            style={[estilos.campo, { color: cores.texto }]}
            placeholder="Digite uma tarefita..."
            placeholderTextColor={cores.suave}
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={aoAdicionar}
            onFocus={() => setFocado(true)}
            onBlur={() => setFocado(false)}
            returnKeyType="done"
            maxLength={80}
          />
          <Pressable
            onPress={aoAdicionar}
            disabled={!podeAdicionar}
            accessibilityRole="button"
            accessibilityLabel="Adicionar tarefita"
            style={({ pressed }) => [
              estilos.botaoAdd,
              { backgroundColor: podeAdicionar ? doces.sol : cores.borda },
              pressed && { opacity: 0.8, transform: [{ scale: 0.92 }] },
            ]}
          >
            <Ionicons name="add" size={28} color={podeAdicionar ? tinta : cores.suave} />
          </Pressable>
        </View>

        <FlatList
          style={estilos.lista}
          contentContainerStyle={[estilos.listaConteudo, { paddingBottom: insets.bottom + 32 }]}
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemTarefa item={item} onAlternar={alternar} onRemover={aoRemover} />}
          ItemSeparatorComponent={Separador}
          ListEmptyComponent={carregado ? EstadoVazio : null}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      <MenuContas
        visivel={menuContas}
        onFechar={() => setMenuContas(false)}
        onNova={() => {
          setMenuContas(false);
          navigation.navigate('NovaConta');
        }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  cabecalho: {
    paddingHorizontal: 22,
    paddingBottom: 58,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  linhaTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  marcaArea: { flex: 1, marginRight: 12 },
  marca: { fontFamily: fonte.preta, fontSize: 36, lineHeight: 42, color: '#FFFFFF', letterSpacing: -0.5 },
  subtitulo: { fontFamily: fonte.media, fontSize: 15, color: 'rgba(255,255,255,0.72)' },
  pilula: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    marginTop: 10,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 10,
    maxWidth: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  pilulaTexto: { flexShrink: 1, fontFamily: fonte.negrito, fontSize: 13, color: '#FFFFFF' },
  acoes: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fotoBotao: { borderWidth: 2.5, borderColor: '#FFFFFF' },
  progressoArea: { marginTop: 24 },

  corpo: { flex: 1, marginTop: -32 },
  entrada: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingLeft: 20,
    paddingRight: 8,
    height: 64,
    borderRadius: 22,
    borderWidth: 2,
  },
  campo: { flex: 1, height: '100%', fontFamily: fonte.negrito, fontSize: 16 },
  botaoAdd: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lista: { flex: 1 },
  listaConteudo: { paddingHorizontal: 20, paddingTop: 22 },
});
