const tbody = document.getElementById('funcionario-table-body');
const template = document.getElementById('funcionario-row-template');
const modal = document.getElementById('excluirModal');
const btnConfirmar = document.getElementById('confirmarExclusao');
const btnCancelar = document.getElementById('cancelarExclusao');
let idExcluir = null;


fetch('/funcionario/listar')
    .then(response => {                      
        return response.json(); }) 
    .then(funcionarios => {
        console.log(funcionarios)  
        preencherTabela(funcionarios);
    })
    .catch(error => {
        console.error('Erro ao buscar funcionários:', error);
        // Trate o erro de forma mais apropriada (exibindo uma mensagem, por exemplo)
    });


function preencherTabela(funcionarios) {
    tbody.innerHTML = '';

    funcionarios.forEach(funcionario => {
        adicionarLinhaTabela(funcionario);
    });
}

function adicionarLinhaTabela(funcionario) {
    const row = template.content.cloneNode(true).querySelector('tr');
    row.querySelector('.id').textContent = funcionario.num_reg_func; // Use num_reg_func
    row.querySelector('.nome').textContent = funcionario.nome_func; // Use nome_func

    const btnEditar = row.querySelector('.editar');
    btnEditar.onclick = () => {
        window.location.href = `cadastro_funcionario.html?id=${funcionario.num_reg_func}&nome=${funcionario.nome_func}`;
    };

    const btnExcluir = row.querySelector('.excluir');
    btnExcluir.onclick = () => {
        modal.style.display = 'block';
        idExcluir = funcionario.num_reg_func;
    };

    tbody.appendChild(row);
}

btnConfirmar.onclick = () => {
    fetch(`/excluir_funcionario/${idExcluir}`, { // Substitua pela sua rota
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            modal.style.display = 'none';
            const rowToRemove = tbody.querySelector(`tr[data-id="${idExcluir}"]`);
            if (rowToRemove) {
                tbody.removeChild(rowToRemove);
            }
            alert('Funcionário excluído com sucesso.');
        } else {
            throw new Error('Erro ao excluir funcionário.');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir funcionário:', error);
        alert('Erro ao excluir funcionário. Por favor, tente novamente mais tarde.');
    });
};

btnCancelar.onclick = () => {
    modal.style.display = 'none';
};
