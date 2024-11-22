from sqlalchemy import Column, Integer, Numeric, Date, Enum
from dbm import Base, DatabaseManager  # Importa a base e o gerenciador de banco de dados

# Modelo Frete
class Frete(Base):
    __tablename__ = 'frete'
    num_conhecimento = Column(Integer, primary_key=True)  # Número do conhecimento (chave primária)
    cod_cli = Column(Integer, nullable=False)  # Código do cliente (chave estrangeira)
    num_reg_func = Column(Integer, nullable=False)  # Número do registro do funcionário (chave estrangeira)
    cod_cid = Column(Integer, nullable=False)  # Código da cidade (chave estrangeira)
    data_frete = Column(Date, nullable=False)  # Data do frete
    peso_ou_valor = Column(Enum('Peso', 'Valor', name='peso_ou_valor_enum'), nullable=False)  # Tipo de frete
    pedagio = Column(Numeric(10, 2), nullable=True)  # Valor do pedágio
    icms = Column(Numeric(10, 2), nullable=False)  # ICMS aplicado no frete
    quem_paga_frete = Column(Enum('Remetente', 'Destinatário', name='quem_paga_frete_enum'), nullable=False)  # Quem paga o frete
    valor_frete = Column(Numeric(10, 2), nullable=False)  # Valor total do frete
    peso_frete = Column(Numeric(10, 2), nullable=False)  # Peso total do frete


# CRUD para Frete
class FreteCRUD:
    def __init__(self, db_manager):
        self.db_manager = db_manager

    def criar_frete(self, cod_cli, num_reg_func, cod_cid, data_frete, peso_ou_valor, pedagio, icms, quem_paga_frete, valor_frete, peso_frete):
        """Cria um novo frete."""
        session = self.db_manager.get_session()
        try:
            novo_frete = Frete(
                cod_cli=cod_cli,
                num_reg_func=num_reg_func,
                cod_cid=cod_cid,
                data_frete=data_frete,
                peso_ou_valor=peso_ou_valor,
                pedagio=pedagio,
                icms=icms,
                quem_paga_frete=quem_paga_frete,
                valor_frete=valor_frete,
                peso_frete=peso_frete
            )
            session.add(novo_frete)
            session.commit()
            print(f"Frete criado com sucesso! Número de Conhecimento: {novo_frete.num_conhecimento}")
            return {
                "num_conhecimento": novo_frete.num_conhecimento,
                "cod_cli": novo_frete.cod_cli,
                "num_reg_func": novo_frete.num_reg_func,
                "cod_cid": novo_frete.cod_cid,
                "data_frete": novo_frete.data_frete,
                "peso_ou_valor": novo_frete.peso_ou_valor,
                "pedagio": novo_frete.pedagio,
                "icms": novo_frete.icms,
                "quem_paga_frete": novo_frete.quem_paga_frete,
                "valor_frete": novo_frete.valor_frete,
                "peso_frete": novo_frete.peso_frete
            }
        except Exception as e:
            session.rollback()
            print(f"Erro ao criar frete: {e}")
            raise e
        finally:
            session.close()

    def listar_fretes(self):
        """Lista todos os fretes."""
        session = self.db_manager.get_session()
        try:
            fretes = session.query(Frete).all()
            lista_fretes = [
                {
                    "num_conhecimento": frete.num_conhecimento,
                    "cod_cli": frete.cod_cli,
                    "num_reg_func": frete.num_reg_func,
                    "cod_cid": frete.cod_cid,
                    "data_frete": frete.data_frete,
                    "peso_ou_valor": frete.peso_ou_valor,
                    "pedagio": frete.pedagio,
                    "icms": frete.icms,
                    "quem_paga_frete": frete.quem_paga_frete,
                    "valor_frete": frete.valor_frete,
                    "peso_frete": frete.peso_frete
                }
                for frete in fretes
            ]
            return lista_fretes
        except Exception as e:
            print(f"Erro ao listar fretes: {e}")
            raise e
        finally:
            session.close()

    def atualizar_frete(self, num_conhecimento, novo_valor_frete, novo_peso_frete, novo_icms):
        """Atualiza os dados de um frete."""
        session = self.db_manager.get_session()
        try:
            frete = session.query(Frete).filter_by(num_conhecimento=num_conhecimento).first()
            if not frete:
                print(f"Frete com número de conhecimento {num_conhecimento} não encontrado.")
                return None

            frete.valor_frete = novo_valor_frete
            frete.peso_frete = novo_peso_frete
            frete.icms = novo_icms
            session.commit()
            print(f"Frete {num_conhecimento} atualizado com sucesso!")
            return {
                "num_conhecimento": frete.num_conhecimento,
                "valor_frete": frete.valor_frete,
                "peso_frete": frete.peso_frete,
                "icms": frete.icms
            }
        except Exception as e:
            session.rollback()
            print(f"Erro ao atualizar frete: {e}")
            raise e
        finally:
            session.close()

    def deletar_frete(self, num_conhecimento):
        """Deleta um frete."""
        session = self.db_manager.get_session()
        try:
            frete = session.query(Frete).filter_by(num_conhecimento=num_conhecimento).first()
            if not frete:
                print(f"Frete com número de conhecimento {num_conhecimento} não encontrado.")
                return None

            session.delete(frete)
            session.commit()
            print(f"Frete {num_conhecimento} deletado com sucesso!")
            return {"message": f"Frete {num_conhecimento} deletado com sucesso!"}
        except Exception as e:
            session.rollback()
            print(f"Erro ao deletar frete: {e}")
            raise e
        finally:
            session.close()
    def verificar_fretes_por_estado(self, cod_uf):
        """Verifica se existem fretes associados a um estado."""
        session = self.db_manager.get_session()
        try:
            # Consulta para verificar se há fretes com o cod_uf fornecido
            return session.query(Frete).filter(Frete.cod_uf_origem == cod_uf).count() > 0 or \
                session.query(Frete).filter(Frete.cod_uf_destino == cod_uf).count() > 0

        except Exception as e:
            print(f"Erro ao verificar fretes por estado: {e}")
            raise  # Repassa a exceção para ser tratada na rota
        finally:
            session.close()

