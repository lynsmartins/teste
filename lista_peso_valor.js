const tbody = document.getElementById('peso-valor-table-body');
const template = document.getElementById('peso-valor-row-template');
const modal = document.getElementById('excluirModal');
const btnConfirmar = document.getElementById('confirmarExclusao');
const btnCancelar = document.getElementById('cancelarExclusao');
let idExcluir = null;

// Mock de pesos e valores (substitua pela busca real no banco de dados)
const pesosValoresMock = [
    { id: 1, estado: "SP", cidade: "São Paulo", preco_valor: 10.50, preco_peso: 5.20 },
    { id: 2, estado: "RJ", cidade: "Rio de Janeiro", preco_valor: 12.00, preco_peso: 6.00 },
    // ... adicione mais cidades, estados, preços por valor e peso
];

preencherTabela(pesosValoresMock);

fetch('/pesos_valores') // Substitua pela sua rota
    .then(response => response.json())
    .then(pesosValores => {
        preencherTabela(pesosValores);
    })
    .catch(error => {
        console.error('Erro ao buscar pesos e valores:', error);
        // Trate o erro (exibindo uma mensagem, por exemplo)
    });

function preencherTabela(pesosValores) {
    tbody.innerHTML = '';

    pesosValores.forEach(item => {
        adicionarLinhaTabela(item);
    });
}

function adicionarLinhaTabela(item) {
    const row = template.content.cloneNode(true).querySelector('tr');
    row.dataset.id = item.id;

    row.querySelector('.id').textContent = item.id;
    row.querySelector('.estado').textContent = item.estado;
    row.querySelector('.cidade').textContent = item.cidade;
    row.querySelector('.preco_valor').textContent = item.preco_valor;
    row.querySelector('.preco_peso').textContent = item.preco_peso;

    const btnEditar = row.querySelector('.editar');
    btnEditar.onclick = () => {
        window.location.href = `cadastro_peso_valor.html?id=${item.id}&estado=${item.estado}&cidade=${item.cidade}&preco_valor=${item.preco_valor}&preco_peso=${item.preco_peso}`;
    };

    const btnExcluir = row.querySelector('.excluir');
    btnExcluir.onclick = () => {
        modal.style.display = 'block';
        idExcluir = item.id;
    };

    tbody.appendChild(row);
}


btnConfirmar.onclick = () => {
    fetch(`/excluir_peso_valor/${idExcluir}`, { // Substitua pela sua rota
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            modal.style.display = 'none';

            const rowToRemove = tbody.querySelector(`tr[data-id="${idExcluir}"]`);
            if (rowToRemove) {
                tbody.removeChild(rowToRemove);
            }
            alert('Peso e valor excluído com sucesso!');

        } else {
            throw new Error('Erro ao excluir peso e valor.');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir peso e valor:', error);
        alert('Erro ao excluir peso e valor. Por favor, tente novamente mais tarde.');
    });
};

btnCancelar.onclick = () => {
    modal.style.display = 'none';
};

// const tbody = document.getElementById('peso-valor-table-body');
// const template = document.getElementById('peso-valor-row-template');
// const modal = document.getElementById('excluirModal');
// const btnConfirmar = document.getElementById('confirmarExclusao');
// const btnCancelar = document.getElementById('cancelarExclusao');
// let idExcluir = null;

// // Simulando a busca de dados (substitua pela sua lógica)
// fetch('/peso_valor')  // Substitua pela sua rota
//     .then(response => response.json())
//     .then(pesoValor => {
//         pesoValor.forEach(pesoValor => {
//             adicionarLinhaTabela(pesoValor);
//         });
//     })
//     .catch(error => {
//         console.error('Erro ao buscar peso e valor:', error);
//         // Lidar com o erro de forma mais apropriada para o usuário
//     });

// function adicionarLinhaTabela(pesoValor) {
//     const row = template.content.cloneNode(true).querySelector('tr');

//     row.querySelector('.id').textContent = pesoValor.id;
//     row.querySelector('.estado').textContent = pesoValor.estado;
//     row.querySelector('.cidade').textContent = pesoValor.cidade;
//     row.querySelector('.preco_valor').textContent = pesoValor.preco_valor;
//     row.querySelector('.preco_peso').textContent = pesoValor.preco_peso;

//     const btnEditar = row.querySelector('.editar');
//     btnEditar.onclick = () => {
//         window.location.href = `cadastro_peso_valor.html?id=${pesoValor.id}&estado=${pesoValor.estado}&cidade=${pesoValor.cidade}&preco_valor=${pesoValor.preco_valor}&preco_peso=${pesoValor.preco_peso}`;
//     };

//     const btnExcluir = row.querySelector('.excluir');
//     btnExcluir.onclick = () => {
//         modal.style.display = 'block';
//         idExcluir = pesoValor.id;
//     };

//     tbody.appendChild(row);
// }

// btnConfirmar.onclick = () => {
//     fetch(`/excluir_peso_valor/${idExcluir}`, { // Substitua pela sua rota
//         method: 'DELETE'
//     })
//     .then(response => {
//         if (response.ok) {
//             modal.style.display = 'none';
//             tbody.removeChild(document.querySelector(`tr[data-id="${idExcluir}"]`)); // Remove a linha correta
//             alert('Peso e valor excluído com sucesso.');
//             // Recarrega a página ou atualiza a tabela após a exclusão
//         } else {
//             throw new Error('Erro ao excluir peso e valor.');
//         }
//     })
//     .catch(error => {
//         console.error('Erro ao excluir peso e valor:', error);
//         alert('Erro ao excluir peso e valor. Por favor, tente novamente mais tarde.');
//     });
// };

// btnCancelar.onclick = () => {
//     modal.style.display = 'none';
// };
