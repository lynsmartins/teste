from sqlalchemy import Column, Integer, String, Date, ForeignKey, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

Base = declarative_base()

# Modelo Cliente
class Cliente(Base):
    __tablename__ = 'cliente'
    cod_cli = Column(Integer, primary_key=True, autoincrement=True)  # Código do cliente
    data_insc = Column(Date, nullable=False)  # Data de inscrição do cliente
    endereco_cli = Column(String(155), nullable=False)  # Endereço do cliente
    telefone_cli = Column(String(15), nullable=False)  # Telefone do cliente

# Modelo Pessoa Física
class PessoaFisica(Base):
    __tablename__ = 'pessoa_fisica'
    cpf = Column(String(11), primary_key=True)  # CPF da pessoa física
    cod_cli = Column(Integer, ForeignKey('cliente.cod_cli'), nullable=False)  # Código do cliente associado
    nome_cli = Column(String(155), nullable=False)  # Nome da pessoa física

class PessoaJuridica(Base):
    __tablename__ = 'pessoa_juridica'
    cnpj = Column(String(11), primary_key=True)  
    cod_cli = Column(Integer, ForeignKey('cliente.cod_cli'), nullable=False)  # Código do cliente associado
    razao_social = Column(String(155), nullable=False)  
    insc_estadual = Column(String(20), nullable=False)

# CRUD para Cliente e Pessoa Física
class ClienteCRUD:
    def __init__(self, db_url):
        self.engine = create_engine(db_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)

    def criar_cliente(self, data_insc, endereco_cli, telefone_cli):
        session = self.Session()
        try:
            novo_cliente = Cliente(
                data_insc=data_insc,
                endereco_cli=endereco_cli,
                telefone_cli=telefone_cli
            )
            session.add(novo_cliente)
            session.commit()
            return novo_cliente.cod_cli
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Erro ao criar cliente: {e}")
            raise
        finally:
            session.close()

    def criar_pessoa_fisica(self, cpf, cod_cli, nome_cli):
        session = self.Session()
        try:
            pessoa_fisica = PessoaFisica(
                cpf=cpf,
                cod_cli=cod_cli,
                nome_cli=nome_cli
            )
            session.add(pessoa_fisica)
            session.commit()
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Erro ao criar pessoa física: {e}")
            raise
        finally:
            session.close()

    def criar_pessoa_juridica(self, cnpj, cod_cli, razao_social, insc_estadual):
        session = self.Session()
        try:
            pessoa_juridica = PessoaJuridica(
                cnpj=cnpj,
                cod_cli=cod_cli,
                razao_social=razao_social,
                insc_estadual=insc_estadual
            )
            session.add(pessoa_juridica)
            session.commit()
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Erro ao criar pessoa jurídica: {e}")
            raise
        finally:
            session.close()

    def listar_nome_clientes(self):
        session = self.Session()  # Supondo que você tenha um Session configurado
        try:
            # Consulta SQL com UNION ALL
            query = text("""
                SELECT pf.NOME_CLI AS NOME
                FROM PESSOA_FISICA pf
                INNER JOIN CLIENTE c ON pf.COD_CLI = c.COD_CLI

                UNION ALL

                SELECT pj.RAZAO_SOCIAL AS NOME
                FROM PESSOA_JURIDICA pj
                INNER JOIN CLIENTE c ON pj.COD_CLI = c.COD_CLI
            """)

            # Executando a consulta
            resultados = session.execute(query).fetchall()

            clientes = [
                {"nome": row[0]}  # ou row.NOME se você estiver usando Core
                for row in resultados
            ]
            
        except SQLAlchemyError as e:
            session.rollback()  # Faz rollback em caso de erro
            print(f"Erro ao listar clientes: {e}")
            raise
        finally:
            session.close()  # Fecha a sessão sempre, mesmo em caso de erro
                                
        return clientes
