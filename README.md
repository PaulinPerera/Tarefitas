# Tarefitas

Aplicativo de lista de tarefas feito com React Native + Expo (atividade prática de Desenvolvimento de Aplicativos Mobile).

## Funcionalidades

- Adicionar, listar (`FlatList`) e apagar tarefas
- Marcar tarefa como concluída
- Contador de tarefas e barra de progresso (um segmento por tarefita)
- Tarefas salvas no aparelho com `AsyncStorage`
- Tema claro e escuro (a escolha também fica salva)
- Ícones com `@expo/vector-icons`
- Tela de **Cadastro** na primeira abertura (nome, e-mail e foto da galeria ou câmera), com validação
- Tela de **Perfil** (nome, e-mail, foto e botão de voltar) com `React Navigation`
- **Várias contas** no mesmo aparelho: trocar de conta (pela Tela de Tarefas ou pelo Perfil) e cadastrar nova conta. Cada conta tem a sua própria lista de tarefas
- Tela de **Editar perfil** (altera nome, e-mail e foto) e opção de remover a conta
- Painel **Armazenamento local** no Perfil: lista o que está salvo e testa o `AsyncStorage`

## Como rodar

```bash
npm install
npx expo install --fix   # alinha as versões das bibliotecas com o Expo SDK do projeto
npx expo start
```

Abra com o app Expo Go no celular (QR code) ou pressione `a` / `i` / `w` para Android, iOS ou web.

> O projeto usa **Expo SDK 57**, que é a versão suportada pelo Expo Go atual das lojas. O Expo Go só abre projetos do mesmo SDK dele.
> Se o celular não conectar, use `npx expo start --tunnel`.

## Estrutura

```
App.js                     navegação (React Navigation) e providers
src/
  tema.js                  cores, fontes, tema claro/escuro
  tarefas.js               estado das tarefas + AsyncStorage
  usuario.js               contas e conta ativa (contexto)
  contas.js                como as contas/tarefas ficam no AsyncStorage (+ migração)
  fotos.js                 escolher/salvar a foto de perfil
  armazenamento.js         teste e resumo do AsyncStorage
  telas/TelaCadastro.js    cadastro (1ª abertura)
  telas/TelaTarefas.js     tela principal
  telas/TelaPerfil.js      perfil
  telas/TelaEditarPerfil.js editar nome, e-mail e foto
  telas/TelaNovaConta.js   cadastrar outra conta
  componentes/             FormUsuario, Avatar, MenuFoto, MenuContas, ListaContas,
                           PainelArmazenamento,
                           BotaoIcone, Progresso, ItemTarefa, EstadoVazio
assets/                    ícone, splash e foto de perfil
```

## Como os dados ficam salvos (AsyncStorage)

| Chave | Conteúdo |
|---|---|
| `@tarefitas:contas` | lista de contas (nome, e-mail, foto) |
| `@tarefitas:contaAtiva` | id da conta em uso |
| `@tarefitas:tarefas:<id>` | tarefas de cada conta |
| `@tarefitas:tema` | tema claro/escuro (vale para o aparelho todo) |
