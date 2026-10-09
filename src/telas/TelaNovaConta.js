import React from 'react';
import FormUsuario from '../componentes/FormUsuario';
import { useUsuario } from '../usuario';

// Cadastra OUTRA conta no mesmo aparelho. Ao salvar, a nova conta vira a ativa
// e voltamos para as Tarefas (que já mostram a lista da conta nova).
export default function TelaNovaConta({ navigation }) {
  const { contas, criarConta } = useUsuario();
  return (
    <FormUsuario
      titulo="Nova conta"
      subtitulo="Cadastre outra pessoa neste aparelho"
      textoBotao="Criar conta"
      emailsEmUso={contas.map((c) => c.email)}
      onVoltar={() => navigation.goBack()}
      onSalvar={async (dados) => {
        await criarConta(dados);
        navigation.navigate('Tarefas');
      }}
    />
  );
}
