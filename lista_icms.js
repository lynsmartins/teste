const tbody = document.getElementById('icms-table-body');
const template = document.getElementById('icms-row-template');
const modal = document.getElementById('excluirModal');
const btnConfirmar = document.getElementById('confirmarExclusao');
const btnCancelar = document.getElementById('cancelarExclusao');
let codUfExcluir = null;

fetch('/estado/listar_dados')
    .then(response => {
        if (!response.ok) {
            return response.headers.get("content-type").includes("application/json")
                ? response.json().then(json => Promise.reject(json.error || 'Erro no servidor')) // Mensagem padrão se 'error' não existir
                : response.text().then(text => Promise.reject(text)); 
        }
        return response.json();
    })
    .then(estados => {
        preencherTabela(estados);
    })
    .catch(error => {
        console.error('Erro ao buscar estados:', error);
        alert(error); // Exibe a mensagem de erro diretamente
    });

function preencherTabela(estados) {
    tbody.innerHTML = '';
    estados.forEach(estado => adicionarLinhaTabela(estado));
}

function adicionarLinhaTabela(estado) {
    const row = template.content.cloneNode(true).querySelector('tr');
    row.querySelector('.estado').textContent = estado.nome_est;
    row.querySelector('.icms_local').textContent = estado.icms_local;
    row.querySelector('.icms_outro').textContent = estado.icms_outro_uf;
    row.dataset.coduf = estado.cod_uf;

    const btnEditar = row.querySelector('.editar');
    btnEditar.onclick = () => {
        window.location.href = `cadastro_icms.html?cod_uf=${estado.cod_uf}`;
    };

    const btnExcluir = row.querySelector('.excluir');
    btnExcluir.onclick = () => {
        modal.style.display = 'block';
        codUfExcluir = estado.cod_uf;
    };

    tbody.appendChild(row);
}

btnConfirmar.onclick = () => {
    if (!codUfExcluir) {
        console.error("Nenhum estado selecionado para exclusão.");
        alert("Erro ao excluir. Nenhum estado selecionado.");
        return;
    }

    fetch(`/estado/excluir/${codUfExcluir}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                return response.json().then(json => Promise.reject(json.error || 'Erro no servidor')); // Lida com erros de API
            }
            return response.json(); // Retorna a resposta JSON se ok
        })
        .then(() => { // Adiciona um then para lidar com o sucesso
            modal.style.display = 'none';
            codUfExcluir = null;
            tbody.querySelector(`[data-coduf="${codUfExcluir}"]`).remove(); // Remove a linha da tabela visualmente
            alert('Estado excluído com sucesso!'); // Alerta de sucesso
        })        
        .catch(error => {
            console.error('Erro ao excluir estado:', error);
            alert(error); // Exibe a mensagem de erro diretamente
            modal.style.display = 'none';
            codUfExcluir = null;
        });
};

btnCancelar.onclick = () => {
    modal.style.display = 'none';
    codUfExcluir = null;
};

