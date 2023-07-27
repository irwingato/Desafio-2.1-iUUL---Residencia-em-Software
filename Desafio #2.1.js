// Importação das bibliotecas fs (File System) e DateTime do pacote 'luxon'
const fs = require('fs');
const { DateTime } = require('luxon');

// Definição da classe FileHandler, responsável por lidar com a leitura do arquivo de entrada
class FileHandler {
  constructor(caminhoArquivo) {
    this.caminhoArquivo = caminhoArquivo;
  }

  // Função para ler o arquivo de entrada e retornar seu conteúdo parseado como um objeto JavaScript
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

// Definição da classe abstrata CampoValidator, que será a base para as validações dos campos
class CampoValidator {
  // Método abstrato validar(valor) que será implementado nas classes filhas
  validar(valor) {
    throw new Error('Método validar deve ser implementado.');
  }
}

// Definição da classe NomeValidator, que herda de CampoValidator e é responsável por validar o campo "nome"
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
    if (resto !== parseInt(cpf.charAt(10))) {
      return false;
    }

    return true;
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

// Definição da classe ClienteValidator, que será responsável por validar todos os campos do cliente
class ClienteValidator {
  constructor(validators) {
    this.validators = validators;
  }

  // Função para validar o cliente com base nos validadores dos campos
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

// Definição da classe ErroFileGenerator, responsável por gerar o arquivo de erros em formato JSON
class ErroFileGenerator {
  gerarArquivoErros(clientesComErros) {
    // Cria o nome do arquivo de erros com base na data e hora atual
    const nomeArquivo = new NomeArquivoGenerator().gerarNomeArquivo();
    try {
      // Escreve o arquivo de erros em formato JSON com os clientes que possuem erros de validação
      fs.writeFileSync(nomeArquivo, JSON.stringify(clientesComErros, null, 2), 'utf-8');
      console.log(`Arquivo de erros gerado com sucesso: ${nomeArquivo}`);
    } catch (erro) {
      console.error('Erro ao gerar o arquivo de erros:', erro.message);
      process.exit(1);
    }
  }
}

// Verifica se o caminho do arquivo de entrada foi fornecido
if (process.argv.length < 3) {
  console.error('Caminho do arquivo de entrada não fornecido');
  process.exit(1);
}

// Obtém o caminho do arquivo de entrada a partir do argumento da linha de comando
const caminhoArquivo = process.argv[2];

// Cria uma instância do FileHandler com o caminho do arquivo de entrada
const fileHandler = new FileHandler(caminhoArquivo);

// Lê o arquivo de entrada e obtém os clientes em formato de objeto JavaScript
const clientes = fileHandler.lerArquivoEntrada();

// Verifica se o arquivo de entrada contém um Array de clientes
if (!Array.isArray(clientes)) {
  console.error('O arquivo de entrada não contém um Array.');
  process.exit(1);
}

// Array contendo os validadores para cada campo do cliente
const validators = [
  { campo: 'nome', validator: new NomeValidator() },
  { campo: 'cpf', validator: new CPFValidator() },
  { campo: 'dt_nascimento', validator: new DataNascimentoValidator() },
  { campo: 'renda_mensal', validator: new RendaMensalValidator() },
  { campo: 'estado_civil', validator: new EstadoCivilValidator() },
];

// Cria uma instância do ClienteValidator com os validadores dos campos
const clienteValidator = new ClienteValidator(validators);

// Array para armazenar os clientes com erros de validação
const clientesComErros = [];

// Valida cada cliente do arquivo de entrada
for (const cliente of clientes) {
  const erros = clienteValidator.validarCliente(cliente);
  if (erros) {
    clientesComErros.push({ dados: cliente, erros });
  }
}

// Verifica se houve erros de validação e gera o arquivo de erros, se necessário
const erroFileGenerator = new ErroFileGenerator();
if (clientesComErros.length > 0) {
  erroFileGenerator.gerarArquivoErros(clientesComErros);
} else {
  erroFileGenerator.gerarArquivoErros([]);
}