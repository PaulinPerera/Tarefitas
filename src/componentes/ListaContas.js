import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doces, fonte, tinta, useTema } from '../tema';
import { useUsuario } from '../usuario';
import { uriDaFoto } from '../fotos';
import Avatar from './Avatar';

// Lista de contas do aparelho: toque para trocar, ou adicione uma nova.
export default function ListaContas({ onEscolher, onNova }) {
  const { cores } = useTema();
  const { contas, usuario, trocarConta } = useUsuario();

  return (
    <View style={estilos.lista}>
      {contas.map((conta) => {
        const ativa = usuario && conta.id === usuario.id;
        return (
          <Pressable
            key={conta.id}
            onPress={async () => {
              await trocarConta(conta.id);
              if (onEscolher) onEscolher(conta);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: !!ativa }}
            accessibilityLabel={`${ativa ? 'Conta ativa: ' : 'Trocar para a conta de '}${conta.nome}`}
            style={({ pressed }) => [
              estilos.linha,
              {
                backgroundColor: ativa ? 'rgba(110,219,176,0.16)' : cores.fundo,
                borderColor: ativa ? doces.menta : cores.borda,
              },
              pressed && { opacity: 0.75 },
            ]}
          >
            <Avatar uri={uriDaFoto(conta.foto)} nome={conta.nome} tamanho={46} />
            <View style={estilos.textos}>
              <Text numberOfLines={1} style={[estilos.nome, { color: cores.texto }]}>
                {conta.nome}
              </Text>
              <Text numberOfLines={1} style={[estilos.email, { color: cores.suave }]}>
                {conta.email}
              </Text>
            </View>
            {ativa ? (
              <View style={estilos.selo}>
                <Ionicons name="checkmark-circle" size={20} color="#2BA67A" />
                <Text style={estilos.seloTexto}>Ativa</Text>
              </View>
            ) : (
              <Ionicons name="swap-horizontal" size={20} color={cores.suave} />
            )}
          </Pressable>
        );
      })}

      <Pressable
        onPress={onNova}
        accessibilityRole="button"
        accessibilityLabel="Cadastrar nova conta"
        style={({ pressed }) => [
          estilos.linha,
          estilos.nova,
          { borderColor: cores.borda },
          pressed && { opacity: 0.75 },
        ]}
      >
        <View style={estilos.maisBolha}>
          <Ionicons name="add" size={26} color={tinta} />
        </View>
        <Text style={[estilos.nome, { color: cores.texto, flex: 1 }]}>Cadastrar nova conta</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  lista: { gap: 10 },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    paddingRight: 14,
    borderRadius: 20,
    borderWidth: 2,
  },
  textos: { flex: 1 },
  nome: { fontFamily: fonte.negrito, fontSize: 16 },
  email: { fontFamily: fonte.media, fontSize: 13 },
  selo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seloTexto: { fontFamily: fonte.forte, fontSize: 13, color: '#2BA67A' },
  nova: { borderStyle: 'dashed', backgroundColor: 'transparent' },
  maisBolha: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: doces.sol,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
