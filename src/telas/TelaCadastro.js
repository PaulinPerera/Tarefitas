import React from 'react';
import FormUsuario from '../componentes/FormUsuario';
import { useUsuario } from '../usuario';

// Aparece quando não existe nenhuma conta (primeira abertura, ou depois de remover
// todas). Ao salvar, o App troca sozinho para a tela de Tarefas.
export default function TelaCadastro() {
  const { criarConta } = useUsuario();
  return (
    <FormUsuario
      titulo="Bem-vindo(a)!"
      subtitulo="Crie seu perfil para começar a usar o Tarefitas"
      textoBotao="Criar meu perfil"
      onSalvar={criarConta}
    />
  );
}
