import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doces, fonte, sombra, tinta, useTema } from '../tema';
import { lerResumo, testarArmazenamento } from '../armazenamento';
import { useUsuario } from '../usuario';
import { useTarefas } from '../tarefas';

function formatarBytes(b) {
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;
}

// Mostra o que está guardado no aparelho e deixa o usuário testar o AsyncStorage.
export default function PainelArmazenamento() {
  const { cores, escuro } = useTema();
  const [itens, setItens] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [testando, setTestando] = useState(false);
  const { usuario, contas } = useUsuario();
  const { carregado, total } = useTarefas();

  const atualizar = useCallback(async () => {
    try {
      setItens(await lerResumo());
    } catch (erro) {
      setItens([]);
    }
  }, []);

  // Atualiza ao abrir e sempre que a conta ou as tarefas mudam (com uma 2ª leitura
  // logo depois, para pegar o que acabou de ser gravado).
  useEffect(() => {
    atualizar();
    const t = setTimeout(atualizar, 400);
    return () => clearTimeout(t);
  }, [atualizar, usuario?.id, contas.length, carregado, total]);

  const testar = async () => {
    setTestando(true);
    setResultado(null);
    const r = await testarArmazenamento();
    setResultado(r);
    await atualizar();
    setTestando(false);
  };

  return (
    <View style={[estilos.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }, sombra(cores, escuro)]}>
      <View style={estilos.topo}>
        <View style={estilos.icone}>
          <Ionicons name="save-outline" size={20} color={tinta} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[estilos.titulo, { color: cores.texto }]}>Armazenamento local</Text>
          <Text style={[estilos.legenda, { color: cores.suave }]}>
            Dados guardados no seu celular (AsyncStorage). Continuam lá mesmo depois de fechar o app.
          </Text>
        </View>
      </View>

      <View style={[estilos.lista, { borderColor: cores.borda }]}>
        {itens.length === 0 ? (
          <Text style={[estilos.vazio, { color: cores.suave }]}>Nada salvo ainda.</Text>
        ) : (
          itens.map((item) => (
            <View key={item.chave} style={estilos.linha}>
              <View style={{ flex: 1 }}>
                <Text style={[estilos.rotulo, { color: cores.texto }]}>{item.rotulo}</Text>
                {item.detalhe ? <Text style={[estilos.detalhe, { color: cores.suave }]}>{item.detalhe}</Text> : null}
              </View>
              <Text style={[estilos.bytes, { color: cores.suave }]}>{formatarBytes(item.bytes)}</Text>
            </View>
          ))
        )}
      </View>

      {resultado && (
        <View
          style={[
            estilos.resultado,
            { backgroundColor: resultado.ok ? 'rgba(110,219,176,0.22)' : cores.perigoSuave },
          ]}
        >
          <Ionicons
            name={resultado.ok ? 'checkmark-circle' : 'alert-circle'}
            size={22}
            color={resultado.ok ? '#2BA67A' : cores.perigo}
          />
          <Text style={[estilos.resultadoTexto, { color: cores.texto }]}>
            {resultado.ok
              ? `Funcionando! Gravou, leu e conferiu em ${resultado.ms} ms.`
              : `Falhou: ${resultado.mensagem}`}
          </Text>
        </View>
      )}

      <Pressable
        onPress={testar}
        disabled={testando}
        accessibilityRole="button"
        accessibilityLabel="Testar AsyncStorage"
        style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
      >
        {testando ? (
          <ActivityIndicator color={tinta} />
        ) : (
          <>
            <Ionicons name="flask-outline" size={20} color={tinta} />
            <Text style={estilos.botaoTexto}>Testar AsyncStorage</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { marginTop: 20, marginHorizontal: 20, padding: 16, borderRadius: 22, borderWidth: 1.5 },
  topo: { flexDirection: 'row', alignItems: 'flex-start' },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: doces.ceu,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  titulo: { fontFamily: fonte.negrito, fontSize: 16 },
  legenda: { fontFamily: fonte.media, fontSize: 13, lineHeight: 18, marginTop: 2 },
  lista: { marginTop: 14, borderTopWidth: 1.5, paddingTop: 6 },
  linha: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  rotulo: { fontFamily: fonte.negrito, fontSize: 15 },
  detalhe: { fontFamily: fonte.media, fontSize: 13 },
  bytes: { fontFamily: fonte.negrito, fontSize: 13 },
  vazio: { fontFamily: fonte.media, fontSize: 14, paddingVertical: 8 },
  resultado: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, marginTop: 8 },
  resultadoTexto: { flex: 1, fontFamily: fonte.negrito, fontSize: 14, lineHeight: 19 },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 16,
    marginTop: 12,
    backgroundColor: doces.ceu,
  },
  botaoTexto: { fontFamily: fonte.forte, fontSize: 15, color: tinta },
});
