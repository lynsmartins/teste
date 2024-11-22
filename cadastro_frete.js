const remetenteSelect = document.getElementById('remetente');
const destinatarioSelect = document.getElementById('destinatario');
const funcionarioSelect = document.getElementById('funcionario');
const cidadeOrigemSelect = document.getElementById('cidade_origem');
const cidadeDestinoSelect = document.getElementById('cidade_destino');
const dataFreteInput = document.getElementById('data_frete');
const pesoValorSelect = document.getElementById('peso_valor');
const valorFreteInput = document.getElementById('valor_frete');
const pedagioInput = document.getElementById('pedagio');
const icmsInput = document.getElementById('icms');
const quemPagaSelect = document.getElementById('quem_paga');
const form = document.querySelector('form');

icmsInput.readOnly = true;
valorFreteInput.readOnly = true;

let cidades = [];

async function buscarDados(tipoBusca, valor) {
    let endpoint = '';
    if (tipoBusca === 'codigo') {
        endpoint = `/cidade/listar_por_codigo/${valor}`;
    } else if (tipoBusca === 'nome') {
        endpoint = `/cidade/listar/${valor}`; 
    } else if (tipoBusca === 'listar_nomes') {
        endpoint = '/cliente/listar_nomes';
    } else if (tipoBusca === 'listar_funcionarios') {
        endpoint = '/funcionario/listar';
    } else if (tipoBusca === 'listar_estados') {
        endpoint = '/estado/listar';
    } else {
        console.error("Tipo de busca inválido:", tipoBusca);
        alert("O tipo de busca fornecido é inválido. Por favor, tente novamente.");
        return []; // Lidar com tipo de busca inválido
    }

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            const errorData = await response.json(); // Tentar obter detalhes do erro do servidor
            const errorMessage = errorData.error || errorData.message || `Erro HTTP: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage); // Lançar um erro com a mensagem do servidor, se disponível
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar dados de ${endpoint}:`, error);
        alert(`Erro ao carregar dados. ${error.message}. Por favor, tente novamente mais tarde.`); // Exibir mensagem de erro mais informativa
        return [];
    }
}

function preencherDropdown(selectElement, options, valueKey = "value", textKey = "text") {
    selectElement.innerHTML = '<option value="">Selecione</option>';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option[valueKey];
        optionElement.text = option[textKey];
        selectElement.appendChild(optionElement);
    });
}

async function preencherRemetentes() {
    const remetentes = await buscarDados('listar_nomes');
    preencherDropdown(remetenteSelect, remetentes, 'nome', 'nome');
}

async function preencherDestinatarios() {
    const destinatarios = await buscarDados('listar_nomes');
    preencherDropdown(destinatarioSelect, destinatarios, 'nome', 'nome');
}

async function preencherFuncionarios() {
    const funcionarios = await buscarDados('listar_funcionarios');
    preencherDropdown(funcionarioSelect, funcionarios, 'nome_func', 'nome_func');
}

async function preencherCidades() {
    try {
        const response = await fetch('/cidade/listar'); // Buscar todos os dados das cidades
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }
        const todasCidades = await response.json();

        // Extrair os códigos das cidades
        const codigosCidades = todasCidades.map(cidade => cidade.cod_cid);

        // Buscar os dados completos de cada cidade usando o código
        cidades = await Promise.all(
            codigosCidades.map(codigo => buscarDados('codigo', codigo))
        );

        const formattedCidades = cidades.map(cidade => ({
            value: cidade.cod_cid,
            text: `${cidade.nome_cid} (${cidade.cod_uf})`
        }));

        preencherDropdown(cidadeOrigemSelect, formattedCidades);
        preencherDropdown(cidadeDestinoSelect, formattedCidades);

    } catch (error) {
        console.error("Erro ao preencher cidades:", error);
        alert("Erro ao carregar cidades. Por favor, tente novamente mais tarde.");
    }
}



function preencherPesoValor() {
    const opcoesPesoValor = [
        { value: 'Peso', text: 'Peso' },
        { value: 'Valor', text: 'Valor' }
    ];
    preencherDropdown(pesoValorSelect, opcoesPesoValor);
}

function preencherQuemPaga() {
    const opcoesQuemPaga = [
        { value: 'remetente', text: 'Remetente' },
        { value: 'destinatario', text: 'Destinatário' }
    ];
    preencherDropdown(quemPagaSelect, opcoesQuemPaga);
}

async function preencherSelects() {
    remetenteSelect.innerHTML = '<option value="">Selecione um remetente</option>';
    destinatarioSelect.innerHTML = '<option value="">Selecione um destinatário</option>';
    funcionarioSelect.innerHTML = '<option value="">Selecione um funcionário</option>';
    cidadeOrigemSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
    cidadeDestinoSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
    pesoValorSelect.innerHTML = '<option value="">Selecione</option>';
    quemPagaSelect.innerHTML = '<option value="">Selecione</option>';

    await preencherRemetentes();
    await preencherDestinatarios();
    await preencherFuncionarios();
    await preencherCidades();
    await preencherPesoValor();
    await preencherQuemPaga();
}

preencherSelects();

function getCidadeByCodigo(codigo) {
    return cidades.find(cidade => {
        console.log(typeof codigo, typeof cidade.cod_cid); // Adicione este log
        return parseInt(codigo) === cidade.cod_cid; // Converte codigo para número
    });
}


async function atualizarFrete() {
    const cidadeDestinoCodigo = cidadeDestinoSelect.value;
    const tipoFrete = pesoValorSelect.value;

    if (cidadeDestinoCodigo && tipoFrete) {
        try {
            const cidadeDestinoData = await buscarDados('codigo', cidadeDestinoCodigo);
            //console.log(cidadeDestinoData); //O ERRO TÁ NESSA BOSTA AQUI
            //console.log("tipoFrete:", tipoFrete);
            if (tipoFrete === 'valor') {
                console.log("Valor do frete (valor):", cidadeDestinoData.preco_unit_valor_cid);
                valorFreteInput.value = cidadeDestinoData?.preco_unit_valor_cid || "";
            } else if (tipoFrete === 'peso') {
                console.log("Valor do frete (peso):", cidadeDestinoData.preco_unit_peso_cid);
                valorFreteInput.value = cidadeDestinoData?.preco_unit_peso_cid || "";
            }
        } catch (error) {
            console.error("Erro ao atualizar frete:", error);
            valorFreteInput.value = "";
            alert("Erro ao atualizar o frete. Por favor, tente novamente.");
        }
    } else {
        valorFreteInput.value = "";
    }
}

async function atualizarIcms() {
    const cidadeOrigemCodigo = cidadeOrigemSelect.value;
    const cidadeDestinoCodigo = cidadeDestinoSelect.value;

    if (!cidadeOrigemCodigo || !cidadeDestinoCodigo) {
        icmsInput.value = ""; // Limpar o campo se não houver cidades selecionadas
        return; // Sair da função
    }

    try {
        const cidadeOrigemData = await buscarDados('codigo', cidadeOrigemCodigo);
        const cidadeDestinoData = await buscarDados('codigo', cidadeDestinoCodigo);

        if (!cidadeOrigemData) {
            throw new Error("Cidade de origem não encontrada.");
        }

        if (!cidadeDestinoData) {
            throw new Error("Cidade de destino não encontrada.");
        }

        const estadoDestino = cidadeDestinoData.estado;
        const icmsData = await buscarDados('listar_estados');

        if (!icmsData || !Array.isArray(icmsData) || !icmsData.length) { // Verificar se icmsData é um array não vazio
            throw new Error("Dados de ICMS não encontrados ou inválidos.");
        }

        // Encontrar o estado específico dentro de icmsData
        const estadoIcms = icmsData.find(estado => estado.cod_uf === estadoDestino);

        if (!estadoIcms) {
            throw new Error(`Estado ${estadoDestino} não encontrado nos dados de ICMS.`);
        }


        icmsInput.value = cidadeOrigemData.estado === estadoDestino ? estadoIcms.icms_local : estadoIcms.icms_outro_uf;

    } catch (error) {
        console.error("Erro ao atualizar ICMS:", error);
        icmsInput.value = ""; // Limpar o campo em caso de erro
        alert(`Erro ao calcular ICMS: ${error.message}`); // Exibir mensagem de erro ao usuário
    }
}



cidadeDestinoSelect.addEventListener('change', atualizarFrete);
cidadeOrigemSelect.addEventListener('change', atualizarIcms);
pesoValorSelect.addEventListener('change', atualizarFrete);


form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('/frete/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Erro ao cadastrar frete.';
            throw new Error(errorMessage);
        }

        alert('Frete cadastrado com sucesso!');
        form.reset();
        preencherSelects();
        atualizarFrete();
        atualizarIcms();
    } catch (error) {
        console.error('Erro ao cadastrar frete:', error);
        alert(error.message || 'Erro ao cadastrar frete. Por favor, tente novamente mais tarde.');
    }
});

function validarFormulario() {
    const mensagensErro = [];

    if (remetenteSelect.value === "") {
        mensagensErro.push('Por favor, selecione o remetente.');
    }

    if (destinatarioSelect.value === "") {
        mensagensErro.push('Por favor, selecione o destinatário.');
    }

    if (cidadeOrigemSelect.value === "") {
        mensagensErro.push('Por favor, selecione a cidade de origem.');
    }

    if (cidadeDestinoSelect.value === "") {
        mensagensErro.push('Por favor, selecione a cidade de destino.');
    }

    if (dataFreteInput.value === "") {
        mensagensErro.push('Por favor, selecione a data do frete.');
    }

    if (pesoValorSelect.value === "") {
        mensagensErro.push('Por favor, selecione o tipo de frete (peso ou valor).');
    }

    if (quemPagaSelect.value === "") {
        mensagensErro.push('Por favor, selecione quem paga o frete.');
    }

    if (mensagensErro.length > 0) {
        alert(mensagensErro.join('\n'));
        return false;
    }

    return true;
}

