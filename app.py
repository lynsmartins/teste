from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from dbm import DatabaseManager
from cliente import ClienteCRUD
from funcionario import FuncionarioCRUD
from cidade import CidadeCRUD
from estado import EstadoCRUD
from frete import FreteCRUD
from pf import PessoaFisicaCRUD
from pj import PessoaJuridicaCRUD
from datetime import date

# Configuração do Flask e instância do gerenciador de banco
app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app, resources={r"/*": {"origins": "*"}})
db_manager = DatabaseManager()

# Instância de CRUDs
cliente_crud = ClienteCRUD(db_manager.get_database_url())
funcionario_crud = FuncionarioCRUD(db_manager) 
cidade_crud = CidadeCRUD(db_manager)
estado_crud = EstadoCRUD(db_manager) 
frete_crud = FreteCRUD(db_manager.get_database_url())
pf_crud = PessoaFisicaCRUD(db_manager.get_database_url())


# ==================== Rotas ====================

# Página inicial
@app.route('/')
def home():
    return render_template('home.html')

# ==================== FUNCIONÁRIO ====================
@app.route('/funcionario/cadastro')
def cadastro_funcionario():
    return render_template('funcionario/cadastro_funcionario.html')

@app.route('/funcionario/cadastrar', methods=['POST'])
def cadastrar_funcionario():
    data = request.form
    nome_func = data.get('nome_func')

    if not nome_func:
        return jsonify({'error': 'O campo nome_func é obrigatório.'}), 400

    try:
        funcionario_crud.criar_funcionario(nome_func)
        return jsonify({'message': 'Funcionário cadastrado com sucesso!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/funcionario/lista')
def lista_funcionarios():
    return render_template('funcionario/lista_funcionario.html') 

@app.route('/funcionario/listar', methods=['GET'])
def listar_funcionarios():
    try:
        # Obtém os funcionários do banco de dados
        funcionarios = funcionario_crud.listar_funcionarios()
        return jsonify(funcionarios)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== CLIENTE ====================
@app.route('/cliente_cpf/cadastro')
def cadastro_cliente_cpf():
    return render_template('cliente_cpf/cadastro_cliente_cpf.html')

@app.route('/cliente_cpf/cadastrar', methods=['POST'])
def cadastrar_cliente_cpf():    
    data = request.form
    nome_cli = data.get('nome')
    cpf = data.get('cpf').replace('.', '').replace('-', '')  # Remove pontos e hífen
    endereco_cli = data.get('endereco')
    telefone_cli = data.get('telefone')    

    # Validação dos campos obrigatórios
    if not nome_cli or not cpf or not endereco_cli or not telefone_cli:
        print('Erro de validação: Todos os campos são obrigatórios.')
        return jsonify({'error': 'Todos os campos são obrigatórios.'}), 400

    try:
        print('Tentando criar o cliente...')
        # Criar o cliente
        cod_cli = cliente_crud.criar_cliente(date.today(), endereco_cli, telefone_cli)
        print('Cliente criado com sucesso. Código do cliente:', cod_cli)

        print('Tentando criar a pessoa física associada ao cliente...')
        # Criar a pessoa física associada ao cliente
        cliente_crud.criar_pessoa_fisica(cpf, cod_cli, nome_cli)
        print('Pessoa física criada com sucesso.')

        print('Depois da chamada à função cadastrar_cliente_cpf')
        return jsonify({'message': 'Cliente CPF cadastrado com sucesso!'}), 201

    except Exception as e:
        print('Erro ao cadastrar o cliente:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/cliente_cnpj/cadastro', methods=['GET'])
def cadastro_cliente_cnpj():
    return render_template('cliente_cnpj/cadastro_cliente_cnpj.html')

@app.route('/cliente_cnpj/cadastrar', methods=['POST'])
def cadastrar_cliente_cnpj():    
    print("Requisição recebida:", request.method)
    data = request.form
    razao_social = data.get('razao_social')
    cnpj = data.get('cnpj').replace('.', '').replace('/', '').replace('-', '')  # Remove caracteres especiais
    endereco_cli = data.get('endereco')
    telefone_cli = data.get('telefone')
    insc_estadual = data.get('inscricao_estadual')
              
    try:
        print('Tentando criar o cliente...')
        # Criar o cliente
        cod_cli = cliente_crud.criar_cliente(date.today(), endereco_cli, telefone_cli)
        print('Cliente criado com sucesso. Código do cliente:', cod_cli)

        print('Tentando criar a pessoa jurídica associada ao cliente...')
        # Criar a pessoa jurídica associada ao cliente
        cliente_crud.criar_pessoa_juridica(cnpj, cod_cli, razao_social, insc_estadual)
        print('Pessoa jurídica criada com sucesso.')

        print('Depois da chamada à função cadastrar_cliente_cnpj')
        return jsonify({'message': 'Cliente CNPJ cadastrado com sucesso!'}), 201

    except Exception as e:
        print('Erro ao cadastrar o cliente:', e)
        return jsonify({'error': str(e)}), 500

# @app.route('/cliente/listar', methods=['GET'])
# def listar_clientes():
#     try:
#         clientes = cliente_crud.listar_clientes()
#         return jsonify(clientes), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/cliente/listar_nomes', methods=['GET'])
def listar_nomes_de_clientes():
    try:
        clientes = cliente_crud.listar_nome_clientes()
        return jsonify(clientes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== CIDADE ====================
@app.route('/cidade/cadastro')
def cadastro_cidade():
    return render_template('peso/cadastro_peso_valor.html')

@app.route('/cidade/cadastrar', methods=['POST'])
def cadastrar_cidade():
    data = request.form
    cod_uf = data.get('cod_uf')
    nome_cid = data.get('nome_cid')
    preco_unit_valor_cid = data.get('preco_unit_valor_cid')
    preco_unit_peso_cid = data.get('preco_unit_peso_cid')

    if not cod_uf or not nome_cid or not preco_unit_valor_cid or not preco_unit_peso_cid:
        return jsonify({'error': 'Todos os campos são obrigatórios.'}), 400

    try:
        cidade_crud.criar_cidade(cod_uf, nome_cid, preco_unit_valor_cid, preco_unit_peso_cid)
        return jsonify({'message': 'Cidade cadastrada com sucesso!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/cidade/listar', methods=['GET'])
def listar_cidades():
    try:
        cidades = cidade_crud.listar_cidades()
        return jsonify(cidades), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/cidade/listar_por_codigo/<int:cod_cid>', methods=['GET'])
def listar_cidade_por_codigo(cod_cid):
    try:
        cidade = cidade_crud.buscar_cidade_por_codigo(cod_cid) # Implemente esta função no seu CRUD
        if cidade:
            return jsonify(cidade), 200
        else:
            return jsonify({'message': 'Cidade não encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== ESTADO ====================

@app.route('/listar_estados')
def lista_icms_html():
    try:
        estados = estado_crud.listar_estados()
        return render_template('lista_icms.html', estados=estados)
    except Exception as e:
        return f"Ocorreu um erro: {str(e)}", 500 # Retorna a mensagem de erro como texto com código 500


# @app.route('/estado/listar_dados', methods=['GET'])
# def listar_estados):
#     try:
#         estados = estado_crud.listar_estados()
#         return jsonify(estados), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500 # Retorna o erro como JSON com código 500

@app.route('/estado/cadastro', methods=['GET'])
def cadastro_estado():
    return render_template('icms/cadastro_icms.html')   

@app.route('/estado/cadastrar', methods=['POST'])
def cadastrar_estado():
    data = request.form
    print(data)
    cod_uf = data.get('cod_uf')
    nome_est = data.get('nome_uf')
    icms_local = data.get('icms_local')
    icms_outro_uf = data.get('icms_outro')

    # Validação dos campos obrigatórios
    if not cod_uf or not nome_est or not icms_local or not icms_outro_uf:
        return jsonify({'error': 'Todos os campos são obrigatórios.'}), 400

    
    try:
        # Convertendo valores numéricos
        icms_local = float(icms_local)
        icms_outro_uf = float(icms_outro_uf)
                
        # Chamando o método de criar estado no CRUD
        estado_crud.criar_estado(
            cod_uf=cod_uf, 
            nome_est=nome_est,
            icms_local=icms_local,
            icms_outro_uf=icms_outro_uf)
        return jsonify({
            'message': 'Estado cadastrado com sucesso !',            
        }), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'Erro ao cadastrar estado: {str(e)}'}), 500
    
@app.route('/estado/excluir/<cod_uf>', methods=['DELETE'])
def excluir_estado(cod_uf):
    try:
        # Verificar se existem fretes associados ao estado
        fretes_associados = frete_crud.verificar_fretes_por_estado(cod_uf)  # Função a ser criada no frete_crud

        if fretes_associados:
            return jsonify({'error': 'Não é possível excluir o estado pois existem fretes associados a ele.'}), 400

        estado_crud.deletar_estado(cod_uf)
        return jsonify({'message': 'Estado excluído com sucesso!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== FRETE ====================
@app.route('/frete/cadastro')
def cadastro_frete():
    return render_template('frete/cadastro_frete.html')

@app.route('/frete/cadastrar', methods=['POST'])
def cadastrar_frete():
    data = request.form
    try:
        frete_crud.criar_frete(**data)
        return jsonify({'message': 'Frete cadastrado com sucesso!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/frete/listar', methods=['GET'])
def listar_fretes():
    try:
        # Obtém os fretes do banco de dados
        fretes = frete_crud.listar_fretes()

        # Verifica se a lista de fretes não está vazia
        if not fretes:
            return render_template('frete/listar_frete.html', fretes=[], mensagem="Nenhum frete encontrado.")

        # Renderiza a página HTML com os dados
        return render_template('frete/lista_frete.html', fretes=fretes)
    except Exception as e:
        return render_template('erro.html', mensagem=str(e))

# ==================== Inicialização do App ====================
if __name__ == "__main__":
    app.run(debug=True)
