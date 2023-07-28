// Importa a classe DateTime do pacote 'luxon' para trabalhar com datas e horas
const { DateTime } = require('luxon');

// Classe abstrata CampoValidator: Serve como base para as validações dos campos
class CampoValidator {
    // Método abstrato validar(valor) que será implementado nas classes filhas
    validar(valor) {
        throw new Error('Método validar deve ser implementado.');
    }
}

// Classe NomeValidator: Responsável por validar o campo "nome"
class NomeValidator extends CampoValidator {
    // Método validar(nome): Verifica se o nome é uma string com tamanho entre 5 e 60 caracteres
    validar(nome) {
        return typeof nome === 'string' && nome.length >= 5 && nome.length <= 60;
    }
}

// Classe CPFValidator: Responsável por validar o campo "cpf"
class CPFValidator extends CampoValidator {
    // Método validar(cpf): Verifica se o CPF é válido, removendo caracteres não numéricos e realizando as verificações necessárias
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

// Classe DataNascimentoValidator: Responsável por validar o campo "dt_nascimento"
class DataNascimentoValidator extends CampoValidator {
    // Método validar(dt_nascimento): Converte a data de nascimento em um objeto DateTime do pacote 'luxon'
    // e verifica se a data é válida e se a idade é maior ou igual a 18 anos
    validar(dt_nascimento) {
        const dataNascimento = DateTime.fromFormat(dt_nascimento, 'ddMMyyyy');
        const idade = DateTime.now().diff(dataNascimento, 'years').years;
        return dataNascimento.isValid && idade >= 18;
    }
}

// Classe RendaMensalValidator: Responsável por validar o campo "renda_mensal"
class RendaMensalValidator extends CampoValidator {
    // Método validar(renda_mensal): Verifica se a renda mensal é um número e se é maior ou igual a zero
    validar(renda_mensal) {
        return typeof renda_mensal === 'number' && renda_mensal >= 0;
    }
}

// Classe EstadoCivilValidator: Responsável por validar o campo "estado_civil"
class EstadoCivilValidator extends CampoValidator {
    // Método validar(estado_civil): Verifica se o estado civil é uma string e se está presente no array de estados válidos
    validar(estado_civil) {
        const estadosValidos = ['C', 'S', 'V', 'D'];
        return typeof estado_civil === 'string' && estadosValidos.includes(estado_civil.toUpperCase());
    }
}

// Exporta um objeto contendo as classes de validação para que possam ser utilizadas em outros módulos
module.exports = {
    NomeValidator,
    CPFValidator,
    DataNascimentoValidator,
    RendaMensalValidator,
    EstadoCivilValidator,
};