from sqlalchemy import Column, Integer, String
from dbm import Base  # Importa a base e o gerenciador de banco de dados

# Modelo Funcionario
class Funcionario(Base):
    __tablename__ = 'funcionario'
    num_reg_func = Column(Integer, primary_key=True)  # Número de registro do funcionário
    nome_func = Column(String(155), nullable=False)  # Nome do funcionário

# CRUD para Funcionario
class FuncionarioCRUD:
    def __init__(self, db_manager):
        self.db_manager = db_manager

    def criar_funcionario(self, nome_func):
        """Cria um novo funcionário."""
        session = self.db_manager.get_session()
        try:
            novo_funcionario = Funcionario(nome_func=nome_func)
            session.add(novo_funcionario)
            session.commit()
            print(f"Funcionário criado com sucesso! Número de registro: {novo_funcionario.num_reg_func}")
            return {"num_reg_func": novo_funcionario.num_reg_func, "nome_func": novo_funcionario.nome_func}
        except Exception as e:
            session.rollback()
            print(f"Erro ao criar funcionário: {e}")
            raise e
        finally:
            session.close()

    def listar_funcionarios(self):
        """Lista todos os funcionários."""
        session = self.db_manager.get_session()
        try:
            funcionarios = session.query(Funcionario).all()
            lista_funcionarios = [
                {
                    "num_reg_func": funcionario.num_reg_func,
                    "nome_func": funcionario.nome_func
                }
                for funcionario in funcionarios
            ]
            return lista_funcionarios
        except Exception as e:
            print(f"Erro ao listar funcionários: {e}")
            raise e
        finally:
            session.close()

    def atualizar_funcionario(self, num_reg_func, novo_nome_func):
        """Atualiza o nome de um funcionário."""
        session = self.db_manager.get_session()
        try:
            funcionario = session.query(Funcionario).filter_by(num_reg_func=num_reg_func).first()
            if not funcionario:
                print(f"Funcionário com número de registro {num_reg_func} não encontrado.")
                return None

            funcionario.nome_func = novo_nome_func
            session.commit()
            print(f"Funcionário {num_reg_func} atualizado com sucesso!")
            return {"num_reg_func": funcionario.num_reg_func, "nome_func": funcionario.nome_func}
        except Exception as e:
            session.rollback()
            print(f"Erro ao atualizar funcionário: {e}")
            raise e
        finally:
            session.close()

    def deletar_funcionario(self, num_reg_func):
        """Deleta um funcionário."""
        session = self.db_manager.get_session()
        try:
            funcionario = session.query(Funcionario).filter_by(num_reg_func=num_reg_func).first()
            if not funcionario:
                print(f"Funcionário com número de registro {num_reg_func} não encontrado.")
                return None

            session.delete(funcionario)
            session.commit()
            print(f"Funcionário {num_reg_func} deletado com sucesso!")
            return {"message": f"Funcionário {num_reg_func} deletado com sucesso!"}
        except Exception as e:
            session.rollback()
            print(f"Erro ao deletar funcionário: {e}")
            raise e
        finally:
            session.close()

    

# # Exemplo de uso (somente para testes locais)
# if __name__ == "__main__":
#     db_manager = DatabaseManager()

#     # Certifique-se de que a tabela existe
#     Base.metadata.create_all(db_manager.engine)

#     funcionario_crud = FuncionarioCRUD(db_manager)

# #     # Criar funcionários
# #     print("\nCriando Funcionários...")
# #     funcionario_crud.criar_funcionario(nome_func="João da Silva")
# #     funcionario_crud.criar_funcionario(nome_func="Maria Oliveira")

#     # Listar funcionários
#     print("\nLista de Funcionários:")
#     funcionarios = funcionario_crud.listar_funcionarios()
#     for funcionario in funcionarios:
#         print(funcionario)

#     # Atualizar funcionário
#     print("\nAtualizando Funcionário...")
#     funcionario_crud.atualizar_funcionario(num_reg_func=1, novo_nome_func="João Santos")

#     # Listar funcionários novamente
#     print("\nLista de Funcionários Atualizada:")
#     funcionarios = funcionario_crud.listar_funcionarios()
#     for funcionario in funcionarios:
#         print(funcionario)

#     # Deletar funcionário
#     print("\nDeletando Funcionário...")
#     funcionario_crud.deletar_funcionario(num_reg_func=2)

#     # Listar funcionários novamente
#     print("\nLista de Funcionários Após Exclusão:")
#     funcionarios = funcionario_crud.listar_funcionarios()
#     for funcionario in funcionarios:
#         print(funcionario)

#     # Fechar o gerenciador de conexão
#     db_manager.close()
