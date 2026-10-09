import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { doces, fonte, sombra, tinta, useTema } from '../tema';
import { escolherDaGaleria, salvarFoto, tirarFoto, uriDaFoto } from '../fotos';
import BotaoIcone from './BotaoIcone';
import Avatar from './Avatar';
import MenuFoto from './MenuFoto';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validar(nome, email, emailsEmUso) {
  const erros = {};
  if (nome.trim().length < 2) erros.nome = 'Digite seu nome (mínimo 2 letras).';
  if (email.trim() === '') erros.email = 'Digite seu e-mail.';
  else if (!REGEX_EMAIL.test(email.trim())) erros.email = 'E-mail inválido. Ex.: nome@exemplo.com';
  else if (emailsEmUso.some((e) => e.trim().toLowerCase() === email.trim().toLowerCase()))
    erros.email = 'Já existe uma conta com esse e-mail.';
  return erros;
}

function Campo({ icone, rotulo, erro, focado, children }) {
  const { cores, escuro } = useTema();
  return (
    <View style={estilos.campoArea}>
      <Text style={[estilos.rotulo, { color: cores.suave }]}>{rotulo}</Text>
      <View
        style={[
          estilos.campo,
          {
            backgroundColor: cores.superficie,
            borderColor: erro ? cores.perigo : focado ? doces.lilas : cores.borda,
          },
          sombra(cores, escuro, 0.6),
        ]}
      >
        <Ionicons name={icone} size={20} color={erro ? cores.perigo : cores.suave} style={estilos.campoIcone} />
        {children}
      </View>
      {erro ? <Text style={[estilos.erro, { color: cores.perigo }]}>{erro}</Text> : null}
    </View>
  );
}

// Formulário usado no Cadastro e na Edição de perfil.
export default function FormUsuario({ titulo, subtitulo, textoBotao, inicial, emailsEmUso = [], onSalvar, onVoltar }) {
  const { cores } = useTema();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState(inicial?.nome ?? '');
  const [email, setEmail] = useState(inicial?.email ?? '');
  const [fotoSalva] = useState(inicial?.foto ?? null); // nome do arquivo já salvo
  const [novaFoto, setNovaFoto] = useState(null); // uri recém-escolhida (ainda não copiada)
  const [removida, setRemovida] = useState(false);
  const [erros, setErros] = useState({});
  const [focado, setFocado] = useState(null);
  const [menu, setMenu] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const emailRef = useRef(null);

  const uriExibida = novaFoto ?? (removida ? null : uriDaFoto(fotoSalva));

  const escolher = async (funcao) => {
    setMenu(false);
    try {
      const uri = await funcao();
      if (uri) {
        setNovaFoto(uri);
        setRemovida(false);
      }
    } catch (erro) {
      if (erro && erro.message === 'permissao') {
        Alert.alert('Permissão necessária', 'Libere o acesso à câmera nas configurações do celular para tirar a foto.');
      } else {
        Alert.alert('Ops', 'Não foi possível abrir a imagem. Tente de novo.');
      }
    }
  };

  const remover = () => {
    setMenu(false);
    setNovaFoto(null);
    setRemovida(true);
  };

  const aoSalvar = async () => {
    const e = validar(nome, email, emailsEmUso);
    setErros(e);
    if (Object.keys(e).length > 0) return;

    setSalvando(true);
    try {
      let fotoFinal = removida ? null : fotoSalva;
      if (novaFoto) fotoFinal = await salvarFoto(novaFoto);
      await onSalvar({ nome: nome.trim(), email: email.trim().toLowerCase(), foto: fotoFinal });
    } catch (erro) {
      setSalvando(false);
      Alert.alert('Ops', 'Não foi possível salvar. Tente de novo.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: cores.fundo }} behavior="padding">
      <StatusBar style="light" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View style={[estilos.cabecalho, { backgroundColor: cores.cabecalho, paddingTop: insets.top + 14 }]}>
          {onVoltar ? (
            <View style={estilos.linhaVoltar}>
              <BotaoIcone nome="arrow-back" rotulo="Voltar" onPress={onVoltar} />
            </View>
          ) : null}
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.subtitulo}>{subtitulo}</Text>
        </View>

        <View style={estilos.avatarArea}>
          <Pressable
            onPress={() => setMenu(true)}
            accessibilityRole="button"
            accessibilityLabel="Alterar foto de perfil"
            style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
          >
            <View style={[estilos.avatarAnel, { backgroundColor: cores.fundo }]}>
              <Avatar uri={uriExibida} nome={nome} tamanho={124} />
            </View>
            <View style={[estilos.cameraBadge, { borderColor: cores.fundo }]}>
              <Ionicons name="camera" size={18} color={tinta} />
            </View>
          </Pressable>
          <Text style={[estilos.dica, { color: cores.suave }]}>
            {uriExibida ? 'Toque na foto para trocar' : 'Toque para adicionar uma foto (opcional)'}
          </Text>
        </View>

        <View style={estilos.formulario}>
          <Campo icone="person-outline" rotulo="Nome" erro={erros.nome} focado={focado === 'nome'}>
            <TextInput
              style={[estilos.input, { color: cores.texto }]}
              placeholder="Como você se chama?"
              placeholderTextColor={cores.suave}
              value={nome}
              onChangeText={(t) => {
                setNome(t);
                if (erros.nome) setErros((a) => ({ ...a, nome: undefined }));
              }}
              onFocus={() => setFocado('nome')}
              onBlur={() => setFocado(null)}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={40}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current && emailRef.current.focus()}
            />
          </Campo>

          <Campo icone="mail-outline" rotulo="E-mail" erro={erros.email} focado={focado === 'email'}>
            <TextInput
              ref={emailRef}
              style={[estilos.input, { color: cores.texto }]}
              placeholder="nome@exemplo.com"
              placeholderTextColor={cores.suave}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (erros.email) setErros((a) => ({ ...a, email: undefined }));
              }}
              onFocus={() => setFocado('email')}
              onBlur={() => setFocado(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={80}
              returnKeyType="done"
              onSubmitEditing={aoSalvar}
            />
          </Campo>

          <Pressable
            onPress={aoSalvar}
            disabled={salvando}
            accessibilityRole="button"
            accessibilityLabel={textoBotao}
            style={({ pressed }) => [
              estilos.botao,
              { backgroundColor: doces.sol, opacity: salvando ? 0.7 : 1 },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
          >
            {salvando ? (
              <ActivityIndicator color={tinta} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color={tinta} />
                <Text style={estilos.botaoTexto}>{textoBotao}</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <MenuFoto
        visivel={menu}
        temFoto={!!uriExibida}
        onGaleria={() => escolher(escolherDaGaleria)}
        onCamera={() => escolher(tirarFoto)}
        onRemover={remover}
        onFechar={() => setMenu(false)}
      />
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 22,
    paddingBottom: 96,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  linhaVoltar: { flexDirection: 'row', marginBottom: 10 },
  titulo: { fontFamily: fonte.preta, fontSize: 32, lineHeight: 38, color: '#FFFFFF', letterSpacing: -0.5 },
  subtitulo: { fontFamily: fonte.media, fontSize: 15, color: 'rgba(255,255,255,0.72)', marginTop: 2 },

  avatarArea: { alignItems: 'center', marginTop: -74 },
  avatarAnel: { width: 148, height: 148, borderRadius: 74, alignItems: 'center', justifyContent: 'center' },
  cameraBadge: {
    position: 'absolute',
    right: 4,
    bottom: 6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: doces.sol,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dica: { fontFamily: fonte.media, fontSize: 13, marginTop: 8 },

  formulario: { marginTop: 22, paddingHorizontal: 20 },
  campoArea: { marginBottom: 18 },
  rotulo: { fontFamily: fonte.negrito, fontSize: 13, marginBottom: 6, marginLeft: 4 },
  campo: { flexDirection: 'row', alignItems: 'center', height: 58, borderRadius: 20, borderWidth: 2, paddingHorizontal: 16 },
  campoIcone: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontFamily: fonte.negrito, fontSize: 16 },
  erro: { fontFamily: fonte.negrito, fontSize: 13, marginTop: 6, marginLeft: 4 },

  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 58,
    borderRadius: 20,
    marginTop: 8,
  },
  botaoTexto: { fontFamily: fonte.forte, fontSize: 17, color: tinta },
});
