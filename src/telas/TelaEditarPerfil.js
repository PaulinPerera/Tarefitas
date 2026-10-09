import React from 'react';
import FormUsuario from '../componentes/FormUsuario';
import { useUsuario } from '../usuario';

export default function TelaEditarPerfil({ navigation }) {
  const { usuario, contas, salvar } = useUsuario();
  if (!usuario) return null;
  return (
    <FormUsuario
      titulo="Editar perfil"
      subtitulo="Atualize seu nome, e-mail ou foto"
      textoBotao="Salvar alterações"
      inicial={usuario}
      emailsEmUso={contas.filter((c) => c.id !== usuario.id).map((c) => c.email)}
      onVoltar={() => navigation.goBack()}
      onSalvar={async (dados) => {
        await salvar(dados);
        navigation.goBack();
      }}
    />
  );
}
