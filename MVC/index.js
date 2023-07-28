const { FileHandler, NomeValidator, CPFValidator, DataNascimentoValidator, RendaMensalValidator, EstadoCivilValidator } = require('./Model');
const { ClienteValidator, ErroFileGenerator } = require('./Controller');
const { View } = require('./View');

// Verifica se o caminho do arquivo de entrada foi fornecido
if (process.argv.length < 3) {
    View.exibirMensagemErro('Caminho do arquivo de entrada não fornecido');
}

const caminhoArquivo = process.argv[2];
const fileHandler = new FileHandler(caminhoArquivo);
const clientes = fileHandler.lerArquivoEntrada();

if (!Array.isArray(clientes)) {
    View.exibirMensagemErro('O arquivo de entrada não contém um Array.');
}

const validators = [
    { campo: 'nome', validator: new NomeValidator() },
    { campo: 'cpf', validator: new CPFValidator() },
    { campo: 'dt_nascimento', validator: new DataNascimentoValidator() },
    { campo: 'renda_mensal', validator: new RendaMensalValidator() },
    { campo: 'estado_civil', validator: new EstadoCivilValidator() },
];

const clienteValidator = new ClienteValidator(validators);
const clientesComErros = [];

for (const cliente of clientes) {
    const erros = clienteValidator.validarCliente(cliente);
    if (erros) {
        clientesComErros.push({ dados: cliente, erros });
    }
}

const erroFileGenerator = new ErroFileGenerator();
if (clientesComErros.length > 0) {
    erroFileGenerator.gerarArquivoErros(clientesComErros);
} else {
    erroFileGenerator.gerarArquivoErros([]);
}