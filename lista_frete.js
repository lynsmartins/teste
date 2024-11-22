const tbody = document.getElementById('frete-table-body');
const template = document.getElementById('frete-row-template');
const modal = document.getElementById('excluirModal');
const btnConfirmar = document.getElementById('confirmarExclusao');
const btnCancelar = document.getElementById('cancelarExclusao');
let idExcluir = null;

// Mock de fretes (substitua pela busca real no banco de dados)
const fretesMock = [
    { id: 1, remetente: "João Silva", destinatario: "Maria Souza", origem: "São Paulo", destino: "Rio de Janeiro",  data: "2024-12-26", peso_valor: "Peso", valor_frete: 120.50, pedagio: 25.00, icms: 12.34, quem_paga: "Remetente" },
    { id: 2, remetente: "Evelyn Lopes", destinatario: "Pedro Santos", origem: "Belo Horizonte", destino: "Brasília",  data: "2024-12-27", peso_valor: "Valor", valor_frete: 200.00, pedagio: 0, icms: 20.80, quem_paga: "Destinatário" }
    // Adicione mais fretes mocados aqui...
];

preencherTabela(fretesMock);

fetch('/fretes') // Substitua pela sua rota
    .then(response => response.json())
    .then(fretes => {
        preencherTabela(fretes);
    })
    .catch(error => {
        console.error('Erro ao buscar fretes:', error);
        // Trate o erro de forma apropriada, exibindo uma mensagem na tela, por exemplo
    });


function preencherTabela(fretes) {
    tbody.innerHTML = ''; // Limpa a tabela antes de preencher

    fretes.forEach(frete => {
        adicionarLinhaTabela(frete);
    });
}

function adicionarLinhaTabela(frete) {
    const row = template.content.cloneNode(true).querySelector('tr');
    row.dataset.id = frete.id;

    row.querySelector('.id').textContent = frete.id;
    row.querySelector('.remetente').textContent = frete.remetente;
    row.querySelector('.destinatario').textContent = frete.destinatario;
    row.querySelector('.origem').textContent = frete.origem;
    row.querySelector('.destino').textContent = frete.destino;
    row.querySelector('.data').textContent = frete.data;
    row.querySelector('.peso_valor').textContent = frete.peso_valor;
    row.querySelector('.valor_frete').textContent = frete.valor_frete;
    row.querySelector('.pedagio').textContent = frete.pedagio;
    row.querySelector('.icms').textContent = frete.icms;
    row.querySelector('.quem_paga').textContent = frete.quem_paga;


    const btnEditar = row.querySelector('.editar');
    btnEditar.onclick = () => {
        // Redireciona para a página de cadastro com os dados do frete
        window.location.href = `cadastro_frete.html?id=${frete.id}&remetente=${frete.remetente}&destinatario=${frete.destinatario}&origem=${frete.origem}&destino=${frete.destino}&data=${frete.data}&peso_valor=${frete.peso_valor}&valor_frete=${frete.valor_frete}&pedagio=${frete.pedagio}&icms=${frete.icms}&quem_paga=${frete.quem_paga}`;
    };

    const btnExcluir = row.querySelector('.excluir');
    btnExcluir.onclick = () => {
        modal.style.display = 'block';
        idExcluir = frete.id;
    };

    tbody.appendChild(row);
}


btnConfirmar.onclick = () => {
    fetch(`/excluir_frete/${idExcluir}`, { // Substitua pela sua rota
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            modal.style.display = 'none';
            const rowToRemove = tbody.querySelector(`tr[data-id="${idExcluir}"]`);
            if (rowToRemove) {
                tbody.removeChild(rowToRemove);
            }

            alert('Frete excluído com sucesso.');
        } else {
            throw new Error('Erro ao excluir frete.');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir frete:', error);
        alert('Erro ao excluir frete. Por favor, tente novamente mais tarde.');
    });
};

btnCancelar.onclick = () => {
    modal.style.display = 'none';
};

// const tbody = document.getElementById('frete-table-body');
// const template = document.getElementById('frete-row-template');
// const modal = document.getElementById('excluirModal');
// const btnConfirmar = document.getElementById('confirmarExclusao');
// const btnCancelar = document.getElementById('cancelarExclusao');
// let idExcluir = null;

// // Simulando a busca de dados (substitua pela sua lógica)
// fetch('/fretes')  // Substitua pela sua rota
//     .then(response => response.json())
//     .then(fretes => {
//         fretes.forEach(frete => {
//             adicionarLinhaTabela(frete);
//         });
//     })
//     .catch(error => {
//         console.error('Erro ao buscar fretes:', error);
//         // Lidar com o erro de forma mais apropriada para o usuário
//     });

// function adicionarLinhaTabela(frete) {
//     const row = template.content.cloneNode(true).querySelector('tr');

//     row.querySelector('.id').textContent = frete.id;
//     row.querySelector('.remetente').textContent = frete.remetente;
//     row.querySelector('.destinatario').textContent = frete.destinatario;
//     row.querySelector('.origem').textContent = frete.origem;
//     row.querySelector('.destino').textContent = frete.destino;
//     row.querySelector('.data').textContent = frete.data;
//     row.querySelector('.peso_valor').textContent = frete.peso_valor;
//     row.querySelector('.valor_frete').textContent = frete.valor_frete;
//     row.querySelector('.pedagio').textContent = frete.pedagio;
//     row.querySelector('.icms').textContent = frete.icms;
//     row.querySelector('.quem_paga').textContent = frete.quem_paga;

//     const btnEditar = row.querySelector('.editar');
//     btnEditar.onclick = () => {
//         window.location.href = `cadastro_frete.html?id=${frete.id}&remetente=${frete.remetente}&destinatario=${frete.destinatario}&origem=${frete.origem}&destino=${frete.destino}&data=${frete.data}&peso_valor=${frete.peso_valor}&valor_frete=${frete.valor_frete}&pedagio=${frete.pedagio}&icms=${frete.icms}&quem_paga=${frete.quem_paga}`;
//     };

//     const btnExcluir = row.querySelector('.excluir');
//     btnExcluir.onclick = () => {
//         modal.style.display = 'block';
//         idExcluir = frete.id;
//     };

//     tbody.appendChild(row);
// }

// btnConfirmar.onclick = () => {
//     fetch(`/excluir_frete/${idExcluir}`, { // Substitua pela sua rota
//         method: 'DELETE'
//     })
//     .then(response => {
//         if (response.ok) {
//             modal.style.display = 'none';
//             tbody.removeChild(document.querySelector(`tr[data-id="${idExcluir}"]`)); // Remove a linha correta
//             alert('Frete excluído com sucesso.');
//             // Recarrega a página ou atualiza a tabela após a exclusão
//         } else {
//             throw new Error('Erro ao excluir frete.');
//         }
//     })
//     .catch(error => {
//         console.error('Erro ao excluir frete:', error);
//         alert('Erro ao excluir frete. Por favor, tente novamente mais tarde.');
//     });
// };

// btnCancelar.onclick = () => {
//     modal.style.display = 'none';
// };
