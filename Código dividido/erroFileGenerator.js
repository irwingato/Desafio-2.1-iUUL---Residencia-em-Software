// Importa o módulo fs (File System) para lidar com operações de arquivo
const fs = require('fs');

// Importa a classe DateTime do pacote 'luxon' para trabalhar com datas e horas
const { DateTime } = require('luxon');

// Classe NomeArquivoGenerator: Responsável por gerar o nome do arquivo de erros baseado na data e hora atual
class NomeArquivoGenerator {
    gerarNomeArquivo() {
        // Retorna uma string com o nome do arquivo no formato 'erros-ddMMyyyy-HHmmss.json'
        return `erros-${DateTime.now().toFormat('ddMMyyyy-HHmmss')}.json`;
    }
}

// Classe ErroFileGenerator: Responsável por gerar o arquivo de erros em formato JSON
class ErroFileGenerator {
    // Método gerarArquivoErros: Gera o arquivo de erros com base nos clientes com erros de validação
    gerarArquivoErros(clientesComErros) {
        // Cria uma instância de NomeArquivoGenerator para obter o nome do arquivo
        const nomeArquivo = new NomeArquivoGenerator().gerarNomeArquivo();
        try {
            // Escreve o arquivo de erros em formato JSON com os clientes que possuem erros de validação
            fs.writeFileSync(nomeArquivo, JSON.stringify(clientesComErros, null, 2), 'utf-8');
            console.log(`Arquivo de erros gerado com sucesso: ${nomeArquivo}`);
        } catch (erro) {
            // Em caso de erro na geração do arquivo, exibe a mensagem de erro e encerra o processo
            console.error('Erro ao gerar o arquivo de erros:', erro.message);
            process.exit(1);
        }
    }
}

// Exporta a classe ErroFileGenerator para que possa ser utilizada em outros módulos
module.exports = ErroFileGenerator;