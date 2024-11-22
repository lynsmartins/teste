const estadosSelect = document.getElementById('estado');
const cidadeInput = document.getElementById('cidade');
const precoValorInput = document.getElementById('preco_valor');
const precoPesoInput = document.getElementById('preco_peso');
const form = document.querySelector('form');

// Busca os estados do banco de dados
fetch('/estado/listar') 
    .then(response => response.json())
    .then(estados => {
        // Preenche o select de estados
        estados.forEach(estado => {
            const option = document.createElement('option');
            console.log(option)
            option.text = estado.cod_uf;
            // option.text = estado.nome_est;
            estadosSelect.appendChild(option);
            console.log(estadosSelect)
        });
    })
    .catch(error => {
        console.error('Erro ao buscar estados:', error);
        alert('Erro ao carregar os estados. Por favor, tente novamente mais tarde.');
    });

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const mensagensErro = validarFormulario();
    
    if (mensagensErro.length > 0) {
        alert(mensagensErro.join('\n'));
        return;
    }

    // Todas as validações passaram, envia os dados para o servidor
    const formData = new FormData(form);
    formData.append('cod_uf', estadosSelect.value)
    formData.append('nome_cid', cidadeInput.value)
    formData.append('preco_unit_valor_cid', precoValorInput.value)
    formData.append('preco_unit_peso_cid', precoPesoInput.value)

    fetch('/cidade/cadastrar', { // Substitua '/cadastrar_cidade' pela sua rota
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // ou response.text(), dependendo do retorno do servidor
        } else {
            throw new Error('Erro ao cadastrar cidade.');
        }
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        alert('Cidade cadastrada com sucesso!');
        form.reset(); // Limpa o formulário após o cadastro
    })
    .catch(error => {
        console.error('Erro ao enviar dados para o servidor:', error);
        alert('Erro ao cadastrar cidade. Por favor, tente novamente mais tarde.');
    });
});

function validarFormulario() {
    const mensagensErro = [];

    if (estadosSelect.value === "") {
        mensagensErro.push('Por favor, selecione um estado.');
    }

    if (cidadeInput.value.trim() === "") { 
        mensagensErro.push('Por favor, insira o nome da cidade.');
    }

    if (!precoValorInput.value.trim()) {
        mensagensErro.push('Por favor, insira o preço do frete por valor da mercadoria.');
    } else if (parseFloat(precoValorInput.value) <= 0) {
        mensagensErro.push('O preço do frete por valor da mercadoria deve ser maior que zero.');
    }

    if (!precoPesoInput.value.trim()) {
        mensagensErro.push('Por favor, insira o preço do frete por peso da mercadoria.');
    } else if (parseFloat(precoPesoInput.value) <= 0) {
        mensagensErro.push('O preço do frete por peso da mercadoria deve ser maior que zero.');
    }

    return mensagensErro;
}
// function popularEstados() {
//     let estados = [
//         {'sigla': 'AC', 'nome': 'Acre'},
//         {'sigla': 'AL', 'nome': 'Alagoas'},
//         {'sigla': 'AP', 'nome': 'Amapá'},
//         {'sigla': 'AM', 'nome': 'Amazonas'},
//         {'sigla': 'BA', 'nome': 'Bahia'},
//         {'sigla': 'CE', 'nome': 'Ceará'},
//         {'sigla': 'DF', 'nome': 'Distrito Federal'},
//         {'sigla': 'ES', 'nome': 'Espírito Santo'},
//         {'sigla': 'GO', 'nome': 'Goiás'},
//         {'sigla': 'MA', 'nome': 'Maranhão'},
//         {'sigla': 'MT', 'nome': 'Mato Grosso'},
//         {'sigla': 'MS', 'nome': 'Mato Grosso do Sul'},
//         {'sigla': 'MG', 'nome': 'Minas Gerais'},
//         {'sigla': 'PA', 'nome': 'Pará'},
//         {'sigla': 'PB', 'nome': 'Paraíba'},
//         {'sigla': 'PR', 'nome': 'Paraná'},
//         {'sigla': 'PE', 'nome': 'Pernambuco'},
//         {'sigla': 'PI', 'nome': 'Piauí'},
//         {'sigla': 'RJ', 'nome': 'Rio de Janeiro'},
//         {'sigla': 'RN', 'nome': 'Rio Grande do Norte'},
//         {'sigla': 'RS', 'nome': 'Rio Grande do Sul'},
//         {'sigla': 'RO', 'nome': 'Rondônia'},
//         {'sigla': 'RR', 'nome': 'Roraima'},
//         {'sigla': 'SC', 'nome': 'Santa Catarina'},
//         {'sigla': 'SP', 'nome': 'São Paulo'},
//         {'sigla': 'SE', 'nome': 'Sergipe'},
//         {'sigla': 'TO', 'nome': 'Tocantins'}
//     ];

//     estados.forEach(estado => {
//         const option = document.createElement('option');
//         option.value = estado.sigla; // Adapte para o formato do seu backend
//         option.text = estado.nome; // Adapte para o formato do seu backend
//         estadosSelect.appendChild(option);
//     });

