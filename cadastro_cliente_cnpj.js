const razaoSocialInput = document.getElementById('razao_social');
const cnpjInput = document.getElementById('cnpj');
const inscricaoEstadualInput = document.getElementById('inscricao_estadual');
const enderecoInput = document.getElementById('endereco');
const telefoneInput = document.getElementById('telefone');
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const mensagensErro = validarFormulario();

    if (mensagensErro.length > 0) {
        alert(mensagensErro.join('\n'));
        return;
    }

    // Dados validados, envia para o servidor
    const formData = new FormData(form);
    formData.append('razao_social', razaoSocialInput.value);
    formData.append('cnpj', cnpjInput.value);
    formData.append('inscricao_estadual', inscricaoEstadualInput.value);
    formData.append('telefone', telefoneInput.value);
    formData.append('endereco', enderecoInput.value);

    fetch('/cliente_cnpj/cadastrar', { // Substitua pela sua rota
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Ajuste conforme a resposta do seu servidor
        } else {
            throw new Error('Erro ao cadastrar cliente.'); 
        }
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        alert('Cliente cadastrado com sucesso!');
        form.reset();
    })
    .catch(error => {
        console.error('Erro ao enviar dados para o servidor:', error);
        alert('Erro ao cadastrar cliente. Por favor, tente novamente mais tarde.'); 
    });
});


function validarFormulario() {
    const mensagensErro = [];

    if (razaoSocialInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira a razão social.');
    }

    if (cnpjInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira o CNPJ.');
    } else if (!validarCNPJ(cnpjInput.value.trim())) { // Chama a função de validação de CNPJ
        mensagensErro.push('CNPJ inválido.');
    }


    if (inscricaoEstadualInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira a inscrição estadual.');
    }

    if (enderecoInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira o endereço.');
    }

    if (telefoneInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira o telefone.');
    }


    return mensagensErro;
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,''); // remove caracteres não numéricos
    if(cnpj == '') return false;

    if (cnpj.length != 14)
        return false;


    // Valida primeiro dígito verificador
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0,tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    // Valida segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;

    return true;

}
