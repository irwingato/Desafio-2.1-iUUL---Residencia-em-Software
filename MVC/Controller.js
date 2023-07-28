// Classe ClienteValidator, responsável por validar todos os campos do cliente
class ClienteValidator {
    constructor(validators) {
        this.validators = validators;
    }

    validarCliente(cliente) {
        const erros = [];
        for (const validation of this.validators) {
            const { campo, validator } = validation;
            if (!validator.validar(cliente[campo])) {
                erros.push({ campo, mensagem: `${campo} inválido` });
            }
        }
        return erros.length > 0 ? erros : null;
    }
}

// Classe para gerar o nome do arquivo de erros com base na data e hora atual
class NomeArquivoGenerator {
    gerarNomeArquivo() {
        return `erros-${DateTime.now().toFormat('ddMMyyyy-HHmmss')}.json`;
    }
}

// Classe ErroFileGenerator, responsável por gerar o arquivo de erros em formato JSON
class ErroFileGenerator {
    gerarArquivoErros(clientesComErros) {
        const nomeArquivo = new NomeArquivoGenerator().gerarNomeArquivo();
        try {
            fs.writeFileSync(nomeArquivo, JSON.stringify(clientesComErros, null, 2), 'utf-8');
            console.log(`Arquivo de erros gerado com sucesso: ${nomeArquivo}`);
        } catch (erro) {
            console.error('Erro ao gerar o arquivo de erros:', erro.message);
            process.exit(1);
        }
    }
}

module.exports = {
    ClienteValidator,
    ErroFileGenerator,
};
