import React, { useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';

import { TemaProvider, useTema } from './src/tema';
import { TarefasProvider } from './src/tarefas';
import { UsuarioProvider, useUsuario } from './src/usuario';
import TelaCadastro from './src/telas/TelaCadastro';
import TelaEditarPerfil from './src/telas/TelaEditarPerfil';
import TelaNovaConta from './src/telas/TelaNovaConta';
import TelaTarefas from './src/telas/TelaTarefas';
import TelaPerfil from './src/telas/TelaPerfil';

const Stack = createNativeStackNavigator();

function Rotas() {
  const { cores, escuro } = useTema();
  const { usuario, carregado } = useUsuario();

  // Usa as cores do nosso tema também nas transições, sem "piscar" de branco.
  const temaNavegacao = useMemo(
    () => ({
      ...DefaultTheme,
      dark: escuro,
      colors: {
        ...DefaultTheme.colors,
        background: cores.fundo,
        card: cores.fundo,
        text: cores.texto,
        border: cores.borda,
      },
    }),
    [cores, escuro]
  );

  // Enquanto lê o AsyncStorage, mostra só o fundo (evita piscar a tela de cadastro).
  if (!carregado) return <View style={{ flex: 1, backgroundColor: cores.fundo }} />;

  return (
    <NavigationContainer theme={temaNavegacao}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {usuario ? (
          // Já tem cadastro: telas do app
          <>
            <Stack.Screen name="Tarefas" component={TelaTarefas} />
            <Stack.Screen name="Perfil" component={TelaPerfil} />
            <Stack.Screen name="EditarPerfil" component={TelaEditarPerfil} />
            <Stack.Screen name="NovaConta" component={TelaNovaConta} />
          </>
        ) : (
          // Ainda não tem cadastro: só a tela de cadastro
          <Stack.Screen name="Cadastro" component={TelaCadastro} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontesProntas, erroFontes] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  // Enquanto as fontes carregam, mostra só a cor da splash (sem tela branca).
  if (!fontesProntas && !erroFontes) {
    return <View style={{ flex: 1, backgroundColor: '#25235C' }} />;
  }

  return (
    <SafeAreaProvider>
      <TemaProvider>
        <UsuarioProvider>
          <TarefasProvider>
            <Rotas />
          </TarefasProvider>
        </UsuarioProvider>
      </TemaProvider>
    </SafeAreaProvider>
  );
}
