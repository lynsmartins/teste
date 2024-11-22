from sqlalchemy import Column, String, Integer
from dbm import Base, DatabaseManager  # Importa a base e o gerenciador de banco de dados

# Modelo Pessoa Física
class PessoaFisica(Base):
    __tablename__ = 'pessoa_fisica'
    cpf = Column(String(11), primary_key=True)  # CPF da pessoa física (chave primária)
    cod_cli = Column(Integer, nullable=False)  # Código do cliente (chave estrangeira para tabela CLIENTE)
    nome_cli = Column(String(155), nullable=False)  # Nome da pessoa física


# CRUD para Pessoa Física
class PessoaFisicaCRUD:
    def __init__(self, db_manager):
        self.db_manager = db_manager

    def criar_pessoa_fisica(self, cpf, cod_cli, nome_cli):
        """Cria uma nova pessoa física."""
        session = self.db_manager.get_session()
        try:
            nova_pessoa = PessoaFisica(
                cpf=cpf,
                cod_cli=cod_cli,
                nome_cli=nome_cli
            )
            session.add(nova_pessoa)
            session.commit()
            print(f"Pessoa física criada com sucesso! CPF: {nova_pessoa.cpf}")
            return {
                "cpf": nova_pessoa.cpf,
                "cod_cli": nova_pessoa.cod_cli,
                "nome_cli": nova_pessoa.nome_cli
            }
        except Exception as e:
            session.rollback()
            print(f"Erro ao criar pessoa física: {e}")
            raise e
        finally:
            session.close()

    # def listar_pessoas_fisicas(self):
    #     """Lista todas as pessoas físicas."""
    #     session = self.db_manager.get_session()
    #     try:
    #         pessoas = session.query(PessoaFisica).all()
    #         lista_pessoas = [
    #             {
    #                 "cpf": pessoa.cpf,
    #                 "cod_cli": pessoa.cod_cli,
    #                 "nome_cli": pessoa.nome_cli
    #             }
    #             for pessoa in pessoas
    #         ]
    #         return lista_pessoas
    #     except Exception as e:
    #         print(f"Erro ao listar pessoas físicas: {e}")
    #         raise e
    #     finally:
    #         session.close()

    def atualizar_pessoa_fisica(self, cpf, novo_nome_cli):
        """Atualiza o nome de uma pessoa física."""
        session = self.db_manager.get_session()
        try:
            pessoa = session.query(PessoaFisica).filter_by(cpf=cpf).first()
            if not pessoa:
                print(f"Pessoa física com CPF {cpf} não encontrada.")
                return None

            pessoa.nome_cli = novo_nome_cli
            session.commit()
            print(f"Pessoa física {cpf} atualizada com sucesso!")
            return {
                "cpf": pessoa.cpf,
                "nome_cli": pessoa.nome_cli
            }
        except Exception as e:
            session.rollback()
            print(f"Erro ao atualizar pessoa física: {e}")
            raise e
        finally:
            session.close()

    def deletar_pessoa_fisica(self, cpf):
        """Deleta uma pessoa física."""
        session = self.db_manager.get_session()
        try:
            pessoa = session.query(PessoaFisica).filter_by(cpf=cpf).first()
            if not pessoa:
                print(f"Pessoa física com CPF {cpf} não encontrada.")
                return None

            session.delete(pessoa)
            session.commit()
            print(f"Pessoa física {cpf} deletada com sucesso!")
            return {"message": f"Pessoa física {cpf} deletada com sucesso!"}
        except Exception as e:
            session.rollback()
            print(f"Erro ao deletar pessoa física: {e}")
            raise e
        finally:
            session.close()


# # Exemplo de uso (somente para testes locais)
# if __name__ == "__main__":
#     db_manager = DatabaseManager()

#     # Certifique-se de que a tabela existe
#     Base.metadata.create_all(db_manager.engine)

#     pessoa_fisica_crud = PessoaFisicaCRUD(db_manager)

#     # Criar pessoas físicas
#     print("\nCriando Pessoas Físicas...")
#     pessoa_fisica_crud.criar_pessoa_fisica(cpf="12345678901", cod_cli=1, nome_cli="João da Silva")
#     pessoa_fisica_crud.criar_pessoa_fisica(cpf="98765432100", cod_cli=2, nome_cli="Maria Oliveira")

#     # Listar pessoas físicas
#     print("\nLista de Pessoas Físicas:")
#     pessoas = pessoa_fisica_crud.listar_pessoas_fisicas()
#     for pessoa in pessoas:
#         print(pessoa)

#     # Atualizar pessoa física
#     print("\nAtualizando Pessoa Física...")
#     pessoa_fisica_crud.atualizar_pessoa_fisica(cpf="12345678901", novo_nome_cli="João Santos")

#     # Listar pessoas físicas novamente
#     print("\nLista de Pessoas Físicas Atualizada:")
#     pessoas = pessoa_fisica_crud.listar_pessoas_fisicas()
#     for pessoa in pessoas:
#         print(pessoa)

#     # Deletar pessoa física
#     print("\nDeletando Pessoa Física...")
#     pessoa_fisica_crud.deletar_pessoa_fisica(cpf="98765432100")

#     # Listar pessoas físicas novamente
#     print("\nLista de Pessoas Físicas Após Exclusão:")
#     pessoas = pessoa_fisica_crud.listar_pessoas_fisicas()
#     for pessoa in pessoas:
#         print(pessoa)

#     # Fechar o gerenciador de conexão
#     db_manager.close()
