// Classe para saída do programa e geração de mensagens de erro
class View {
    static exibirMensagemErro(msg) {
      console.error(msg);
      process.exit(1);
    }
  }
  
  module.exports = {
    View,
  };
  