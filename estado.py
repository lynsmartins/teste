from sqlalchemy import Column, Numeric, String
from sqlalchemy.exc import SQLAlchemyError
from dbm import Base

# Modelo Estado
class Estado(Base):
    __tablename__ = 'estado'
    cod_uf = Column(String(155), nullable=False, primary_key=True)  # Código da UF (chave primária)
    nome_est = Column(String(155), nullable=False)  # Nome completo do estado
    icms_local = Column(Numeric(5, 2), nullable=False)  # ICMS para operações locais
    icms_outro_uf = Column(Numeric(5, 2), nullable=False)  # ICMS para operações interestaduais

# CRUD para Estado
class EstadoCRUD:
    def __init__(self, db_manager):
        self.db_manager = db_manager

    def criar_estado(self, cod_uf, nome_est, icms_local, icms_outro_uf):
        """Cria um novo estado com qualquer nome fornecido."""
        session = self.db_manager.get_session()
        try:
            # Verifica se o estado já existe
            estado = session.query(Estado).filter_by(cod_uf=cod_uf).first()
            if estado:
                raise ValueError(f"Estado com código {cod_uf} já existe.")

            # Cria um novo estado
            novo_estado = Estado(
                cod_uf=cod_uf,
                nome_est=nome_est,  # Nome fornecido como parâmetro
                icms_local=icms_local,
                icms_outro_uf=icms_outro_uf
            )
            print("Testando")
            print(novo_estado)
            session.add(novo_estado)
            session.commit()
            print(f"Estado {cod_uf} - {nome_est} criado com sucesso!")
            return {
                "cod_uf": novo_estado.cod_uf,
                "nome_est": novo_estado.nome_est,
                "icms_local": novo_estado.icms_local,
                "icms_outro_uf": novo_estado.icms_outro_uf
            }
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Erro ao criar estado: {e}")
            raise e
        finally:
            session.close()

    def listar_estados(self):
        """Lista todos os estados."""
        session = self.db_manager.get_session()
        try:
            estados = session.query(Estado).all()
            lista_estados = [
                {
                    "cod_uf": estado.cod_uf,
                    "nome_est": estado.nome_est,
                    "icms_local": float(estado.icms_local),
                    "icms_outro_uf": float(estado.icms_outro_uf)
                }
                for estado in estados
            ]
            return lista_estados
        except SQLAlchemyError as e:
            print(f"Erro ao listar estados: {e}")
            raise e
        finally:
            session.close()

    def atualizar_estado(self, cod_uf, novo_icms_local, novo_icms_outro_uf):
        """Atualiza os dados de um estado."""
        session = self.db_manager.get_session()
        try:
            estado = session.query(Estado).filter_by(cod_uf=cod_uf).first()
            if not estado:
                print(f"Estado com código {cod_uf} não encontrado.")
                return None

            estado.icms_local = novo_icms_local
            estado.icms_outro_uf = novo_icms_outro_uf
            session.commit()
            print(f"Estado {cod_uf} atualizado com sucesso!")
            return {
                "cod_uf": estado.cod_uf,
                "icms_local": estado.icms_local,
                "icms_outro_uf": estado.icms_outro_uf
            }
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Erro ao atualizar estado: {e}")
            raise e
        finally:
            session.close()

    def deletar_estado(self, cod_uf):
        """Deleta um estado."""
        session = self.db_manager.get_session()
        try:
            estado = session.query(Estado).filter_by(cod_uf=cod_uf).first()
            if not estado:
                print(f"Estado com código {cod_uf} não encontrado.")
                return None

            session.delete(estado)
            session.commit()
            print(f"Estado {cod_uf} deletado com sucesso!")
            return {"message": f"Estado {cod_uf} deletado com sucesso!"}
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Erro ao deletar estado: {e}")
            raise e
        finally:
            session.close()


# if __name__ == "__main__":
#     from dbm import DatabaseManager
#     db_manager = DatabaseManager()
#     estado_crud = EstadoCRUD(db_manager)

#     icms_local = 1
#     icms_outro_uf = 1

#     icms_local = float(icms_local)
#     icms_outro_uf = float(icms_outro_uf)

#     try:
#         # Teste do método criar_estado
#         print("Criando estado SP...")
#         resultado = estado_crud.criar_estado(cod_uf="SP", nome_est="São Paulo", icms_local=icms_local, icms_outro_uf=icms_outro_uf)
#         print(f"Estado criado: {resultado}")
#     except Exception as e:
#         print(f"Erro ao criar estado: {e}")