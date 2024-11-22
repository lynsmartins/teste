const form = document.querySelector('form'); 
const nomeInput = document.getElementById('nome');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const mensagensErro = validarFormulario();

    if (mensagensErro.length > 0) {
        alert(mensagensErro.join('\n'));
        return;
    }

    const formData = new FormData();
    formData.append('nome_func', nomeInput.value);

    fetch('/funcionario/cadastrar', { 
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // ou response.text(), dependendo do retorno do servidor
        } else {
            throw new Error('Erro ao cadastrar funcionário.');
        }
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        alert('Funcionário cadastrado com sucesso!');
        form.reset();
    })
    .catch(error => {
        console.error('Erro ao enviar dados para o servidor:', error);
        alert('Erro ao cadastrar funcionário. Por favor, tente novamente mais tarde.');
    });
});

function validarFormulario() {
    const mensagensErro = [];

    if (nomeInput.value.trim() === "") {
        mensagensErro.push('Por favor, insira o nome do funcionário.');
    }

    return mensagensErro;
}
