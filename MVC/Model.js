const fs = require('fs');
const { DateTime } = require('luxon');

// Classe FileHandler, responsável por lidar com a leitura do arquivo de entrada
class FileHandler {
    constructor(caminhoArquivo) {
        this.caminhoArquivo = caminhoArquivo;
    }

    lerArquivoEntrada() {
        try {
            const dados = fs.readFileSync(this.caminhoArquivo, 'utf-8');
            return JSON.parse(dados);
        } catch (erro) {
            console.error('Erro ao ler o arquivo de entrada:', erro.message);
            process.exit(1);
        }
    }
}

// Classe abstrata CampoValidator, que será a base para as validações dos campos
class CampoValidator {
    validar(valor) {
        throw new Error('Método validar deve ser implementado.');
    }
}

// Classes de validação dos campos
class NomeValidator extends CampoValidator {
    validar(nome) {
        return typeof nome === 'string' && nome.length >= 5 && nome.length <= 60;
    }
}

// Definição da classe CPFValidator, que herda de CampoValidator e é responsável por validar o campo "cpf"
class CPFValidator extends CampoValidator {
    validar(cpf) {
        // Remove todos os caracteres não numéricos do CPF
        cpf = cpf.replace(/\D/g, '');

        // Verifica se o CPF possui 11 dígitos
        if (cpf.length !== 11) {
            return false;
        }

        // Verifica se o CPF possui todos os dígitos iguais
        if (/^(\d)\1+$/.test(cpf)) {
            return false;
        }

        // Realiza a validação do dígito verificador do CPF
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) {
            resto = 0;
        }
        if (resto !== parseInt(cpf.charAt(9))) {
            return false;
        }

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) {
            resto = 0;
        }
        return resto === parseInt(cpf.charAt(10));

    }
}

// Definição da classe DataNascimentoValidator, que herda de CampoValidator e é responsável por validar o campo "dt_nascimento"
class DataNascimentoValidator extends CampoValidator {
    validar(dt_nascimento) {
        // Converte a data de nascimento para um objeto DateTime do pacote 'luxon'
        const dataNascimento = DateTime.fromFormat(dt_nascimento, 'ddMMyyyy');

        // Calcula a idade a partir da data de nascimento
        const idade = DateTime.now().diff(dataNascimento, 'years').years;

        // Retorna true se a data de nascimento é válida e a idade é maior ou igual a 18 anos
        return dataNascimento.isValid && idade >= 18;
    }
}

// Definição da classe RendaMensalValidator, que herda de CampoValidator e é responsável por validar o campo "renda_mensal"
class RendaMensalValidator extends CampoValidator {
    validar(renda_mensal) {
        return typeof renda_mensal === 'number' && renda_mensal >= 0;
    }
}

// Definição da classe EstadoCivilValidator, que herda de CampoValidator e é responsável por validar o campo "estado_civil"
class EstadoCivilValidator extends CampoValidator {
    validar(estado_civil) {
        const estadosValidos = ['C', 'S', 'V', 'D'];

        // Verifica se o valor do campo "estado_civil" é uma string e se está presente no array de estados válidos
        return typeof estado_civil === 'string' && estadosValidos.includes(estado_civil.toUpperCase());
    }
}

module.exports = {
    FileHandler,
    NomeValidator,
    CPFValidator,
    DataNascimentoValidator,
    RendaMensalValidator,
    EstadoCivilValidator,
};