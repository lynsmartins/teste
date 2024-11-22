from sqlalchemy import Column, String, Integer
from dbm import Base, DatabaseManager  # Importa a base e o gerenciador de banco de dados

# Modelo Pessoa Jurídica
class PessoaJuridica(Base):
    __tablename__ = 'pessoa_juridica'
    cnpj = Column(String(14), primary_key=True)  # CNPJ da pessoa jurídica (chave primária)
    cod_cli = Column(Integer, nullable=False)  # Código do cliente (chave estrangeira para tabela CLIENTE)
    razao_social = Column(String(155), nullable=False)  # Razão social da pessoa jurídica
    insc_estadual = Column(String(20), nullable=False)  # Inscrição estadual da pessoa jurídica


# CRUD para Pessoa Jurídica
class PessoaJuridicaCRUD:
    def __init__(self, db_manager):
        self.db_manager = db_manager

    def criar_pessoa_juridica(self, cnpj, cod_cli, razao_social, insc_estadual):
        """Cria uma nova pessoa jurídica."""
        session = self.db_manager.get_session()
        try:
            nova_pessoa = PessoaJuridica(
                cnpj=cnpj,
                cod_cli=cod_cli,
                razao_social=razao_social,
                insc_estadual=insc_estadual
            )
            session.add(nova_pessoa)
            session.commit()
            print(f"Pessoa jurídica criada com sucesso! CNPJ: {nova_pessoa.cnpj}")
            return {
                "cnpj": nova_pessoa.cnpj,
                "cod_cli": nova_pessoa.cod_cli,
                "razao_social": nova_pessoa.razao_social,
                "insc_estadual": nova_pessoa.insc_estadual
            }
        except Exception as e:
            session.rollback()
            print(f"Erro ao criar pessoa jurídica: {e}")
            raise e
        finally:
            session.close()

    def listar_pessoas_juridicas(self):
        """Lista todas as pessoas jurídicas."""
        session = self.db_manager.get_session()
        try:
            pessoas = session.query(PessoaJuridica).all()
            lista_pessoas = [
                {
                    "cnpj": pessoa.cnpj,
                    "cod_cli": pessoa.cod_cli,
                    "razao_social": pessoa.razao_social,
                    "insc_estadual": pessoa.insc_estadual
                }
                for pessoa in pessoas
            ]
            return lista_pessoas
        except Exception as e:
            print(f"Erro ao listar pessoas jurídicas: {e}")
            raise e
        finally:
            session.close()

    def atualizar_pessoa_juridica(self, cnpj, nova_razao_social, nova_insc_estadual):
        """Atualiza os dados de uma pessoa jurídica."""
        session = self.db_manager.get_session()
        try:
            pessoa = session.query(PessoaJuridica).filter_by(cnpj=cnpj).first()
            if not pessoa:
                print(f"Pessoa jurídica com CNPJ {cnpj} não encontrada.")
                return None

            pessoa.razao_social = nova_razao_social
            pessoa.insc_estadual = nova_insc_estadual
            session.commit()
            print(f"Pessoa jurídica {cnpj} atualizada com sucesso!")
            return {
                "cnpj": pessoa.cnpj,
                "razao_social": pessoa.razao_social,
                "insc_estadual": pessoa.insc_estadual
            }
        except Exception as e:
            session.rollback()
            print(f"Erro ao atualizar pessoa jurídica: {e}")
            raise e
        finally:
            session.close()

    def deletar_pessoa_juridica(self, cnpj):
        """Deleta uma pessoa jurídica."""
        session = self.db_manager.get_session()
        try:
            pessoa = session.query(PessoaJuridica).filter_by(cnpj=cnpj).first()
            if not pessoa:
                print(f"Pessoa jurídica com CNPJ {cnpj} não encontrada.")
                return None

            session.delete(pessoa)
            session.commit()
            print(f"Pessoa jurídica {cnpj} deletada com sucesso!")
            return {"message": f"Pessoa jurídica {cnpj} deletada com sucesso!"}
        except Exception as e:
            session.rollback()
            print(f"Erro ao deletar pessoa jurídica: {e}")
            raise e
        finally:
            session.close()


# # Exemplo de uso (somente para testes locais)
# if __name__ == "__main__":
#     db_manager = DatabaseManager()

#     # Certifique-se de que a tabela existe
#     Base.metadata.create_all(db_manager.engine)

#     pessoa_juridica_crud = PessoaJuridicaCRUD(db_manager)

#     # Criar pessoas jurídicas
#     print("\nCriando Pessoas Jurídicas...")
#     pessoa_juridica_crud.criar_pessoa_juridica(
#         cnpj="12345678000190", cod_cli=1, razao_social="Empresa Exemplo LTDA", insc_estadual="123456789"
#     )
#     pessoa_juridica_crud.criar_pessoa_juridica(
#         cnpj="98765432000100", cod_cli=2, razao_social="Exemplo Comércio e Indústria", insc_estadual="987654321"
#     )

#     # Listar pessoas jurídicas
#     print("\nLista de Pessoas Jurídicas:")
#     pessoas = pessoa_juridica_crud.listar_pessoas_juridicas()
#     for pessoa in pessoas:
#         print(pessoa)

#     # Atualizar pessoa jurídica
#     print("\nAtualizando Pessoa Jurídica...")
#     pessoa_juridica_crud.atualizar_pessoa_juridica(
#         cnpj="12345678000190", nova_razao_social="Empresa Exemplo Atualizada LTDA", nova_insc_estadual="111111111"
#     )

#     # Listar pessoas jurídicas novamente
#     print("\nLista de Pessoas Jurídicas Atualizada:")
#     pessoas = pessoa_juridica_crud.listar_pessoas_juridicas()
#     for pessoa in pessoas:
#         print(pessoa)

#     # Deletar pessoa jurídica
#     print("\nDeletando Pessoa Jurídica...")
#     pessoa_juridica_crud.deletar_pessoa_juridica(cnpj="98765432000100")

#     # Listar pessoas jurídicas novamente
#     print("\nLista de Pessoas Jurídicas Após Exclusão:")
#     pessoas = pessoa_juridica_crud.listar_pessoas_juridicas()
#     for pessoa in pessoas:
#         print(pessoa)

#     # Fechar o gerenciador de conexão
#     db_manager.close()
