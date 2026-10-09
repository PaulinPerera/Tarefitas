import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';

// A foto escolhida fica numa pasta temporária (cache) que o sistema pode limpar.
// Por isso copiamos para a pasta de documentos do app e guardamos só o NOME do arquivo.

const opcoes = {
  mediaTypes: ['images'],
  allowsEditing: true, // deixa o usuário recortar
  aspect: [1, 1], // recorte quadrado (fica redondinho no avatar)
  quality: 0.6,
};

// Devolve a uri da imagem escolhida, ou null se o usuário cancelou.
export async function escolherDaGaleria() {
  const resultado = await ImagePicker.launchImageLibraryAsync(opcoes);
  return resultado.canceled ? null : resultado.assets[0].uri;
}

// Lança um erro com mensagem "permissao" se o usuário negar a câmera.
export async function tirarFoto() {
  const permissao = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissao.granted) throw new Error('permissao');
  const resultado = await ImagePicker.launchCameraAsync(opcoes);
  return resultado.canceled ? null : resultado.assets[0].uri;
}

// Copia a foto para a pasta de documentos do app e devolve o nome do arquivo.
export async function salvarFoto(uriTemporaria) {
  try {
    const nome = `perfil-${Date.now()}.jpg`;
    await new File(uriTemporaria).copy(new File(Paths.document, nome));
    return nome;
  } catch (erro) {
    return uriTemporaria; // plano B: usa a própria uri
  }
}

// Transforma o que foi salvo (nome do arquivo) em uma uri que o <Image> entende.
export function uriDaFoto(foto) {
  if (!foto) return null;
  if (foto.includes(':')) return foto; // já é uma uri completa
  try {
    return new File(Paths.document, foto).uri;
  } catch (erro) {
    return null;
  }
}

export function apagarFoto(foto) {
  if (!foto || foto.includes(':')) return;
  try {
    const arquivo = new File(Paths.document, foto);
    if (arquivo.exists) arquivo.delete();
  } catch (erro) {
    // sem problema: é só limpeza
  }
}
