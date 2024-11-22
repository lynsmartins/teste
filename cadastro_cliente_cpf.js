const nomeInput = document.getElementById('nome');
const cpfInput = document.getElementById('cpf');
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
    formData.append('nome', nomeInput.value);
    formData.append('cpf', cpfInput.value);
    formData.append('endereco', enderecoInput.value);
    formData.append('telefone', telefoneInput.value);   

    console.log('formData');
    console.log(formData);
    fetch('/cliente_cpf/cadastrar', { // Substitua pela sua rota
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
        console.log(error);
        alert('Erro ao cadastrar cliente. Por favor, tente novamente mais tarde.'); 
    });
});

function validarFormulario() {
    const mensagensErro = [];

    if (nomeInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira o nome.');
    }

    if (cpfInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira o CPF.');
    } else if (!validarCPF(cpfInput.value.trim())) {
        mensagensErro.push('CPF inválido.');
    }

    if (enderecoInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira o endereço.');
    }

    if (telefoneInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira o telefone.');
    }

    return mensagensErro;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,''); // remove caracteres não numéricos
    if(cpf == '') return false;
    
    // Elimina CPFs inválidos conhecidos
    if (cpf.length != 11)
            return false;
        
    // Valida 1o digito	
    let add = 0;
    for (let i=0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
      let rev = 11 - (add % 11);
      if (rev == 10 || rev == 11)
          rev = 0;
      if (rev != parseInt(cpf.charAt(9)))
          return false;
        
    // Valida 2o digito	
    add = 0;
    for (let i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
        
    return true;   
}
