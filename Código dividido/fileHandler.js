// Importa o módulo fs (File System) para lidar com operações de arquivo
const fs = require('fs');

// Classe FileHandler: Responsável por lidar com a leitura do arquivo de entrada
class FileHandler {
    // Construtor da classe, recebe o caminho do arquivo de entrada como parâmetro
    constructor(caminhoArquivo) {
        this.caminhoArquivo = caminhoArquivo;
    }

    // Método lerArquivoEntrada: Lê o arquivo de entrada e retorna seu conteúdo parseado como um objeto JavaScript
    lerArquivoEntrada() {
        try {
            // Lê o conteúdo do arquivo de entrada de forma síncrona usando o módulo fs
            // e o codifica para 'utf-8' para obter uma string
            const dados = fs.readFileSync(this.caminhoArquivo, 'utf-8');
            // Converte a string de dados para um objeto JavaScript usando JSON.parse
            return JSON.parse(dados);
        } catch (erro) {
            // Em caso de erro ao ler o arquivo, exibe a mensagem de erro e encerra o processo
            console.error('Erro ao ler o arquivo de entrada:', erro.message);
            process.exit(1);
        }
    }
}

// Exporta a classe FileHandler para que possa ser utilizada em outros módulos
module.exports = FileHandler;