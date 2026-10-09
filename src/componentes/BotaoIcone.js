import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Botão redondo usado nos cabeçalhos (tema, perfil, voltar).
export default function BotaoIcone({
  nome,
  rotulo,
  onPress,
  cor = '#FFFFFF',
  fundo = 'rgba(255,255,255,0.14)',
  tamanho = 44,
  children,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={({ pressed }) => [
        {
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
          backgroundColor: fundo,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] },
        style,
      ]}
    >
      {children ? children : <Ionicons name={nome} size={22} color={cor} />}
    </Pressable>
  );
}
