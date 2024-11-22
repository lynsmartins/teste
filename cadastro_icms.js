const estadoSelect = document.getElementById('estado');
const icmsLocalInput = document.getElementById('icms_local');
const icmsOutroInput = document.getElementById('icms_outro');
const form = document.querySelector('form');

popularEstados();

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const mensagensErro = validarFormulario();

    if (mensagensErro.length > 0) {
        alert(mensagensErro.join('\n'));
        return;
    }

    const sigla = estadoSelect.value; // Obtém a sigla (value da opção)
    const nome = estadoSelect.selectedOptions[0].text; // Obtém o nome (texto exibido na opção)

    const formData = new FormData();
    formData.append('cod_uf', sigla); // Adiciona a sigla ao FormData
    formData.append('nome_uf', nome); // Adiciona o nome ao FormData
    formData.append('icms_local', icmsLocalInput.value);
    formData.append('icms_outro', icmsOutroInput.value);

    console.log("Dados do formulário")
    console.log(formData)

    fetch('/estado/cadastrar', { // Substitua '/cadastrar_icms' pela sua rota de backend
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // ou response.text(), dependendo do retorno do servidor
        } else {
            throw new Error('Erro ao cadastrar ICMS.');
        }
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        alert('ICMS cadastrado com sucesso!');
        form.reset();
    })
    .catch(error => {
        console.error('Erro ao cadastrar ICMS:', error);
        alert('Erro ao cadastrar ICMS. Por favor, tente novamente mais tarde.');
    });
});

function validarFormulario() {
    const mensagensErro = [];

    if (estadoSelect.value === "") {
        mensagensErro.push('Por favor, selecione um estado.');
    }

    if (!icmsLocalInput.value) { // Verifica se o campo não está vazio
        mensagensErro.push('Por favor, insira o ICMS para o estado.');
    } else if (parseFloat(icmsLocalInput.value) < 0) { // Verifica se o valor é não negativo
        mensagensErro.push('O ICMS para o estado não pode ser negativo.');
    }


    if (!icmsOutroInput.value) {
        mensagensErro.push('Por favor, insira o ICMS para outro estado.');
    } else if (parseFloat(icmsOutroInput.value) < 0) {
        mensagensErro.push('O ICMS para outro estado não pode ser negativo.');
    }

    return mensagensErro;
}

function popularEstados() {
    let estados = [
        {'sigla': 'AC', 'nome': 'Acre'},
        {'sigla': 'AL', 'nome': 'Alagoas'},
        {'sigla': 'AP', 'nome': 'Amapá'},
        {'sigla': 'AM', 'nome': 'Amazonas'},
        {'sigla': 'BA', 'nome': 'Bahia'},
        {'sigla': 'CE', 'nome': 'Ceará'},
        {'sigla': 'DF', 'nome': 'Distrito Federal'},
        {'sigla': 'ES', 'nome': 'Espírito Santo'},
        {'sigla': 'GO', 'nome': 'Goiás'},
        {'sigla': 'MA', 'nome': 'Maranhão'},
        {'sigla': 'MT', 'nome': 'Mato Grosso'},
        {'sigla': 'MS', 'nome': 'Mato Grosso do Sul'},
        {'sigla': 'MG', 'nome': 'Minas Gerais'},
        {'sigla': 'PA', 'nome': 'Pará'},
        {'sigla': 'PB', 'nome': 'Paraíba'},
        {'sigla': 'PR', 'nome': 'Paraná'},
        {'sigla': 'PE', 'nome': 'Pernambuco'},
        {'sigla': 'PI', 'nome': 'Piauí'},
        {'sigla': 'RJ', 'nome': 'Rio de Janeiro'},
        {'sigla': 'RN', 'nome': 'Rio Grande do Norte'},
        {'sigla': 'RS', 'nome': 'Rio Grande do Sul'},
        {'sigla': 'RO', 'nome': 'Rondônia'},
        {'sigla': 'RR', 'nome': 'Roraima'},
        {'sigla': 'SC', 'nome': 'Santa Catarina'},
        {'sigla': 'SP', 'nome': 'São Paulo'},
        {'sigla': 'SE', 'nome': 'Sergipe'},
        {'sigla': 'TO', 'nome': 'Tocantins'}
    ];

    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado.sigla; // Adapte para o formato do seu backend
        option.text = estado.nome; // Adapte para o formato do seu backend
        estadoSelect.appendChild(option);
    });
}
