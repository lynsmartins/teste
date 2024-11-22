const tbody = document.getElementById('cliente-cnpj-table-body');
const template = document.getElementById('cliente-cnpj-row-template');
const modal = document.getElementById('excluirModal');
const btnConfirmar = document.getElementById('confirmarExclusao');
const btnCancelar = document.getElementById('cancelarExclusao');
let idExcluir = null;


// Simulando a busca de dados (substitua pela sua lógica)
const clientesMock = [
    { id: 1, razao_social: "Empresa A", cnpj: "12.345.678/0001-99", inscricao_estadual: "123456789", endereco: "Rua X, 123", telefone: "(11) 98765-4321" },
    { id: 2, razao_social: "Empresa B", cnpj: "98.765.432/0001-00", inscricao_estadual: "987654321", endereco: "Rua Y, 456", telefone: "(11) 12345-6789" },
    // ... adicione mais clientes mocados aqui
];

preencherTabela(clientesMock);


fetch('/clientes_cnpj')  // Substitua pela sua rota
    .then(response => response.json())
    .then(clientes => {
        preencherTabela(clientes);
    })
    .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        // Lidar com o erro de forma mais apropriada para o usuário
    });



function preencherTabela(clientes) {
    tbody.innerHTML = '';

    clientes.forEach(cliente => {
        adicionarLinhaTabela(cliente);
    });
}


function adicionarLinhaTabela(cliente) {
    const row = template.content.cloneNode(true).querySelector('tr');
    row.dataset.id = cliente.id;

    row.querySelector('.id').textContent = cliente.id;
    row.querySelector('.razao_social').textContent = cliente.razao_social;
    row.querySelector('.cnpj').textContent = cliente.cnpj;
    row.querySelector('.inscricao_estadual').textContent = cliente.inscricao_estadual;
    row.querySelector('.endereco').textContent = cliente.endereco;
    row.querySelector('.telefone').textContent = cliente.telefone;

    const btnEditar = row.querySelector('.editar');
    btnEditar.onclick = () => {

        // Redireciona para a página de cadastro com os dados do cliente
        window.location.href = `cadastro_cliente_cnpj.html?id=${cliente.id}&razao_social=${cliente.razao_social}&cnpj=${cliente.cnpj}&inscricao_estadual=${cliente.inscricao_estadual}&endereco=${cliente.endereco}&telefone=${cliente.telefone}`;


    };

    const btnExcluir = row.querySelector('.excluir');
    btnExcluir.onclick = () => {
        modal.style.display = 'block';
        idExcluir = cliente.id;
    };

    tbody.appendChild(row);
}



btnConfirmar.onclick = () => {
    fetch(`/excluir_cliente_cnpj/${idExcluir}`, { // Substitua pela sua rota
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            modal.style.display = 'none';
            const rowToRemove = tbody.querySelector(`tr[data-id="${idExcluir}"]`);
            if (rowToRemove) {
                tbody.removeChild(rowToRemove);
            }
            alert('Cliente excluído com sucesso.');
        } else {
            throw new Error('Erro ao excluir cliente.');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir cliente. Por favor, tente novamente mais tarde.');
    });
};


btnCancelar.onclick = () => {
    modal.style.display = 'none';
};

// const tbody = document.getElementById('cliente-cnpj-table-body');
// const template = document.getElementById('cliente-cnpj-row-template');
// const modal = document.getElementById('excluirModal');
// const btnConfirmar = document.getElementById('confirmarExclusao');
// const btnCancelar = document.getElementById('cancelarExclusao');
// let idExcluir = null;

// // Simulando a busca de dados (substitua pela sua lógica)
// fetch('/clientes_cnpj')  // Substitua pela sua rota
//     .then(response => response.json())
//     .then(clientes => {
//         clientes.forEach(cliente => {
//             adicionarLinhaTabela(cliente);
//         });
//     })
//     .catch(error => {
//         console.error('Erro ao buscar clientes:', error);
//         // Lidar com o erro de forma mais apropriada para o usuário
//     });

// function adicionarLinhaTabela(cliente) {
//     const row = template.content.cloneNode(true).querySelector('tr');

//     row.querySelector('.id').textContent = cliente.id;
//     row.querySelector('.razao_social').textContent = cliente.razao_social;
//     row.querySelector('.cnpj').textContent = cliente.cnpj;
//     row.querySelector('.inscricao_estadual').textContent = cliente.inscricao_estadual;
//     row.querySelector('.endereco').textContent = cliente.endereco;
//     row.querySelector('.telefone').textContent = cliente.telefone;

//     const btnEditar = row.querySelector('.editar');
//     btnEditar.onclick = () => {
//         window.location.href = `cadastro_cliente_cnpj.html?id=${cliente.id}&razao_social=${cliente.razao_social}&cnpj=${cliente.cnpj}&inscricao_estadual=${cliente.inscricao_estadual}&endereco=${cliente.endereco}&telefone=${cliente.telefone}`;
//     };

//     const btnExcluir = row.querySelector('.excluir');
//     btnExcluir.onclick = () => {
//         modal.style.display = 'block';
//         idExcluir = cliente.id;
//     };

//     tbody.appendChild(row);
// }

// btnConfirmar.onclick = () => {
//     fetch(`/excluir_cliente_cnpj/${idExcluir}`, { // Substitua pela sua rota
//         method: 'DELETE'
//     })
//     .then(response => {
//         if (response.ok) {
//             modal.style.display = 'none';
//             tbody.removeChild(document.querySelector(`tr[data-id="${idExcluir}"]`)); // Remove a linha correta
//             alert('Cliente excluído com sucesso.');
//             // Recarrega a página ou atualiza a tabela após a exclusão
//         } else {
//             throw new Error('Erro ao excluir cliente.');
//         }
//     })
//     .catch(error => {
//         console.error('Erro ao excluir cliente:', error);
//         alert('Erro ao excluir cliente. Por favor, tente novamente mais tarde.');
//     });
// };

// btnCancelar.onclick = () => {
//     modal.style.display = 'none';
// };
