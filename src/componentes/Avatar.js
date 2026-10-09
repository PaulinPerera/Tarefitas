import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { doces, fonte, tinta } from '../tema';

function iniciais(nome) {
  const partes = (nome || '').trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

// Mostra a foto; se não houver (ou falhar), mostra as iniciais do nome.
export default function Avatar({ uri, nome, tamanho = 100 }) {
  const [falhou, setFalhou] = useState(false);
  useEffect(() => setFalhou(false), [uri]);

  const caixa = { width: tamanho, height: tamanho, borderRadius: tamanho / 2 };

  if (uri && !falhou) {
    return <Image source={{ uri }} style={caixa} onError={() => setFalhou(true)} />;
  }
  return (
    <View style={[caixa, { backgroundColor: doces.lilas, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontFamily: fonte.preta, fontSize: tamanho * 0.38, color: tinta }}>{iniciais(nome)}</Text>
    </View>
  );
}
