// lista_cliente_cpf.js

const tbody = document.getElementById('cliente-cpf-table-body');
const template = document.getElementById('cliente-cpf-row-template');
const excluirModal = document.getElementById('excluirModal');
const cancelarExclusaoBtn = document.getElementById('cancelarExclusao');
const confirmarExclusaoBtn = document.getElementById('confirmarExclusao');


function carregarClientes() {
    fetch('/cliente/listar_nomes') //nome da rota para listar clientes
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar clientes.');
            }
            return response.json();
        })
        .then(clientes => {
            clientes.forEach(cliente => adicionarClienteNaTabela(cliente));
        })
        .catch(error => {
            console.error('Erro ao carregar clientes:', error);
            // Exibir mensagem de erro para o usuário, se necessário
        });
}


function adicionarClienteNaTabela(cliente) {
    const row = template.content.cloneNode(true);
    // Preencher as células da tabela com os dados do cliente
    row.querySelector('.nome').textContent = cliente.nome;
    // ... (Preencher outras células com dados do cliente)

    // Adicionar evento de clique para o botão "Excluir"


    tbody.appendChild(row);
}



// Chamar a função para carregar os clientes quando a página carregar
carregarClientes();

