import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { doces, fonte, sombra, tinta, useTema } from '../tema';
import { useTarefas } from '../tarefas';
import { useUsuario } from '../usuario';
import { uriDaFoto } from '../fotos';
import BotaoIcone from '../componentes/BotaoIcone';
import Avatar from '../componentes/Avatar';
import PainelArmazenamento from '../componentes/PainelArmazenamento';
import ListaContas from '../componentes/ListaContas';

function Numero({ valor, rotulo, cor }) {
  return (
    <View style={[estilos.numero, { backgroundColor: cor }]}>
      <Text style={estilos.numeroValor}>{valor}</Text>
      <Text style={estilos.numeroRotulo}>{rotulo}</Text>
    </View>
  );
}

export default function TelaPerfil({ navigation }) {
  const { cores, escuro, alternarTema } = useTema();
  const { total, feitas, pendentes } = useTarefas();
  const { usuario, contas, removerConta } = useUsuario();
  const insets = useSafeAreaInsets();

  // Ao remover a conta, a tela pode renderizar uma última vez sem usuário.
  if (!usuario) return null;

  const desde = new Date(usuario.criadoEm ?? Date.now()).toLocaleDateString('pt-BR');

  const confirmarRemocao = () => {
    const ultima = contas.length === 1;
    Alert.alert(
      `Remover a conta de ${usuario.nome}?`,
      ultima
        ? 'O perfil e as tarefas desta conta serão apagados deste aparelho e você voltará para a tela de cadastro.'
        : 'O perfil e as tarefas desta conta serão apagados deste aparelho. Você passará para outra conta.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removerConta(usuario.id) },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.fundo }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="light" />

      <View style={[estilos.cabecalho, { backgroundColor: cores.cabecalho, paddingTop: insets.top + 14 }]}>
        <BotaoIcone nome="arrow-back" rotulo="Voltar para as tarefas" onPress={() => navigation.goBack()} />
        <Text style={estilos.tituloCabecalho}>Perfil</Text>
        <BotaoIcone nome="create-outline" rotulo="Editar perfil" onPress={() => navigation.navigate('EditarPerfil')} />
      </View>

      <View style={estilos.avatarArea}>
        <View style={[estilos.avatarAnel, { backgroundColor: cores.fundo }]}>
          <Avatar uri={uriDaFoto(usuario.foto)} nome={usuario.nome} tamanho={140} />
        </View>
        <Text style={[estilos.nome, { color: cores.texto }]}>{usuario.nome}</Text>
        <View style={[estilos.email, { backgroundColor: cores.superficie, borderColor: cores.borda }]}>
          <Ionicons name="mail-outline" size={16} color={cores.suave} />
          <Text style={[estilos.emailTexto, { color: cores.suave }]}>{usuario.email}</Text>
        </View>
        <Text style={[estilos.desde, { color: cores.suave }]}>Cadastrado em {desde}</Text>
      </View>

      <View style={estilos.numeros}>
        <Numero valor={total} rotulo="Tarefitas" cor={doces.ceu} />
        <Numero valor={feitas} rotulo="Feitas" cor={doces.menta} />
        <Numero valor={pendentes} rotulo="Faltam" cor={doces.sol} />
      </View>

      <Pressable
        onPress={() => navigation.navigate('EditarPerfil')}
        accessibilityRole="button"
        accessibilityLabel="Editar perfil"
        style={({ pressed }) => [estilos.editar, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
      >
        <Ionicons name="create-outline" size={20} color={tinta} />
        <Text style={estilos.editarTexto}>Editar perfil</Text>
      </Pressable>

      <View style={[estilos.contasCartao, { backgroundColor: cores.superficie, borderColor: cores.borda }, sombra(cores, escuro)]}>
        <View style={estilos.contasTopo}>
          <View style={estilos.contasIcone}>
            <Ionicons name="people-outline" size={20} color={tinta} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[estilos.contasTitulo, { color: cores.texto }]}>Minhas contas</Text>
            <Text style={[estilos.contasLegenda, { color: cores.suave }]}>
              Toque numa conta para trocar. Cada uma tem suas próprias tarefas.
            </Text>
          </View>
        </View>
        <ListaContas onNova={() => navigation.navigate('NovaConta')} />
      </View>

      <View
        style={[
          estilos.preferencia,
          { backgroundColor: cores.superficie, borderColor: cores.borda },
          sombra(cores, escuro),
        ]}
      >
        <View style={estilos.preferenciaIcone}>
          <Ionicons name={escuro ? 'moon' : 'sunny'} size={20} color={tinta} />
        </View>
        <Text style={[estilos.preferenciaTexto, { color: cores.texto }]}>Tema escuro</Text>
        <Switch
          value={escuro}
          onValueChange={alternarTema}
          trackColor={{ false: cores.borda, true: doces.menta }}
          thumbColor="#FFFFFF"
          accessibilityLabel="Alternar tema escuro"
        />
      </View>

      <PainelArmazenamento />

      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Voltar para as tarefas"
        style={({ pressed }) => [estilos.voltar, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
      >
        <Ionicons name="arrow-back" size={20} color={tinta} />
        <Text style={estilos.voltarTexto}>Voltar para as tarefas</Text>
      </Pressable>

      <Pressable
        onPress={confirmarRemocao}
        accessibilityRole="button"
        accessibilityLabel="Remover esta conta"
        style={({ pressed }) => [
          estilos.sair,
          { backgroundColor: cores.perigoSuave },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Ionicons name="log-out-outline" size={20} color={cores.perigo} />
        <Text style={[estilos.sairTexto, { color: cores.perigo }]}>Remover esta conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 92,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  tituloCabecalho: { fontFamily: fonte.preta, fontSize: 22, color: '#FFFFFF' },

  avatarArea: { alignItems: 'center', marginTop: -78, paddingHorizontal: 20 },
  avatarAnel: { width: 156, height: 156, borderRadius: 78, alignItems: 'center', justifyContent: 'center' },
  nome: { fontFamily: fonte.preta, fontSize: 28, marginTop: 12, textAlign: 'center' },
  email: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  emailTexto: { fontFamily: fonte.negrito, fontSize: 14 },
  desde: { fontFamily: fonte.media, fontSize: 13, marginTop: 8 },

  numeros: { flexDirection: 'row', gap: 12, marginTop: 22, marginHorizontal: 20 },
  numero: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 22 },
  numeroValor: { fontFamily: fonte.preta, fontSize: 30, lineHeight: 36, color: tinta },
  numeroRotulo: { fontFamily: fonte.negrito, fontSize: 13, color: tinta, opacity: 0.75 },

  editar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 18,
    backgroundColor: doces.lilas,
  },
  editarTexto: { fontFamily: fonte.forte, fontSize: 16, color: tinta },

  contasCartao: { marginTop: 16, marginHorizontal: 20, padding: 16, borderRadius: 22, borderWidth: 1.5 },
  contasTopo: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  contasIcone: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: doces.menta,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contasTitulo: { fontFamily: fonte.negrito, fontSize: 16 },
  contasLegenda: { fontFamily: fonte.media, fontSize: 13, lineHeight: 18, marginTop: 2 },

  preferencia: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  preferenciaIcone: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: doces.lilas,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  preferenciaTexto: { flex: 1, fontFamily: fonte.negrito, fontSize: 16 },

  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 58,
    marginTop: 24,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: doces.sol,
  },
  voltarTexto: { fontFamily: fonte.forte, fontSize: 17, color: tinta },

  sair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 18,
  },
  sairTexto: { fontFamily: fonte.forte, fontSize: 15 },
});
