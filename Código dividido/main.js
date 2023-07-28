// Importa a classe FileHandler do arquivo 'fileHandler.js'
const FileHandler = require('./fileHandler');

// Importa as classes de validação do arquivo 'validators.js'
const {
    NomeValidator,
    CPFValidator,
    DataNascimentoValidator,
    RendaMensalValidator,
    EstadoCivilValidator,
} = require('./validators');

// Importa a classe ErroFileGenerator do arquivo 'erroFileGenerator.js'
const ErroFileGenerator = require('./erroFileGenerator');

// Verifica se o caminho do arquivo de entrada foi fornecido como argumento na linha de comando
if (process.argv.length < 3) {
    console.error('Caminho do arquivo de entrada não fornecido');
    process.exit(1);
}

// Obtém o caminho do arquivo de entrada a partir do segundo argumento da linha de comando
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

// Classe ClienteValidator: Responsável por validar todos os campos do cliente
class ClienteValidator {
    constructor(validators) {
        this.validators = validators;
    }

    // Método validarCliente(cliente): Recebe um objeto cliente e valida cada campo utilizando os validadores definidos
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

// Cria uma instância do ErroFileGenerator para gerar o arquivo de erros em formato JSON
const erroFileGenerator = new ErroFileGenerator();

// Verifica se houve erros de validação e gera o arquivo de erros, se necessário
if (clientesComErros.length > 0) {
    erroFileGenerator.gerarArquivoErros(clientesComErros);
} else {
    erroFileGenerator.gerarArquivoErros([]);
}