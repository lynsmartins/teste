from sqlalchemy import Column, Integer, Numeric, String
from dbm import Base, DatabaseManager  # Importa a base e o gerenciador de banco de dados
from sqlalchemy.exc import SQLAlchemyError

# Modelo Cidade
class Cidade(Base):
    __tablename__ = 'cidade'
    cod_cid = Column(Integer, primary_key=True)  # Código da cidade
    cod_uf = Column(String(155), nullable=False)  # Código do estado (chave estrangeira)
    nome_cid = Column(String(155), nullable=False)  # Nome da cidade
    preco_unit_valor_cid = Column(Numeric(10, 2), nullable=False)  # Preço unitário por valor
    preco_unit_peso_cid = Column(Numeric(10, 2), nullable=False)  # Preço unitário por peso

# CRUD para Cidade
class CidadeCRUD:
    def __init__(self, db_manager):
        self.db_manager = db_manager

    def criar_cidade(self, cod_uf, nome_cid, preco_unit_valor_cid, preco_unit_peso_cid):
        """Cria uma nova cidade."""
        session = self.db_manager.get_session()
        try:
            nova_cidade = Cidade(
                cod_uf=cod_uf,
                nome_cid=nome_cid,
                preco_unit_valor_cid=preco_unit_valor_cid,
                preco_unit_peso_cid=preco_unit_peso_cid
            )
            session.add(nova_cidade)
            session.commit()            
            return {"Cidade criada com sucesso! Código: {nova_cidade.cod_cid}"
            }
        except Exception as e:
            session.rollback()
            print(f"Erro ao criar cidade: {e}")
            raise e
        finally:
            session.close()

    def listar_cidades(self):
        """Lista todas as cidades."""
        session = self.db_manager.get_session()
        try:
            cidades = session.query(Cidade).all()
            lista_cidades = [
                {
                    "cod_cid": cidade.cod_cid,
                    "cod_uf": cidade.cod_uf,
                    "nome_cid": cidade.nome_cid,
                    "preco_unit_valor_cid": cidade.preco_unit_valor_cid,
                    "preco_unit_peso_cid": cidade.preco_unit_peso_cid
                }
                for cidade in cidades
            ]
            return lista_cidades
        except Exception as e:
            print(f"Erro ao listar cidades: {e}")
            raise e
        finally:
            session.close()

    def atualizar_cidade(self, cod_cid, novo_preco_valor, novo_preco_peso):
        """Atualiza os preços de uma cidade."""
        session = self.db_manager.get_session()
        try:
            cidade = session.query(Cidade).filter_by(cod_cid=cod_cid).first()
            if not cidade:
                print(f"Cidade com código {cod_cid} não encontrada.")
                return None

            cidade.preco_unit_valor_cid = novo_preco_valor
            cidade.preco_unit_peso_cid = novo_preco_peso
            session.commit()
            print(f"Cidade {cod_cid} atualizada com sucesso!")
            return {
                "cod_cid": cidade.cod_cid,
                "preco_unit_valor_cid": cidade.preco_unit_valor_cid,
                "preco_unit_peso_cid": cidade.preco_unit_peso_cid,
            }
        except Exception as e:
            session.rollback()
            print(f"Erro ao atualizar cidade: {e}")
            raise e
        finally:
            session.close()

    def deletar_cidade(self, cod_cid):
        """Deleta uma cidade."""
        session = self.db_manager.get_session()
        try:
            cidade = session.query(Cidade).filter_by(cod_cid=cod_cid).first()
            if not cidade:
                print(f"Cidade com código {cod_cid} não encontrada.")
                return None

            session.delete(cidade)
            session.commit()
            print(f"Cidade {cod_cid} deletada com sucesso!")
            return {"message": f"Cidade {cod_cid} deletada com sucesso!"}
        except Exception as e:
            session.rollback()
            print(f"Erro ao deletar cidade: {e}")
            raise e
        finally:
            session.close()

    def buscar_cidade_por_nome(self, nome_cid):
        session = self.Session()
        try:
            cidade = session.query(Cidade).filter(Cidade.nome_cid == nome_cid).first()
            if cidade:
                # Converter o objeto Cidade para um dicionário
                cidade_dict = {
                    "cod_cid": cidade.cod_cid,
                    "nome_cid": cidade.nome_cid,
                    "cod_uf": cidade.cod_uf,
                    "peso": cidade.preco_unit_peso_cid,  # Substitua pelos nomes corretos das colunas
                    "valor": cidade.preco_unit_valor_cid   # Substitua pelos nomes corretos das colunas
                }
                return cidade_dict
            else:
                return None
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Erro ao buscar cidade: {e}")
            raise
        finally:
            session.close()


    def buscar_cidade_por_codigo(self, cod_cid): # método agora dentro da classe
        session = self.db_manager.get_session()
        try:
            cidade = session.query(Cidade).filter(Cidade.cod_cid == cod_cid).first() #filter_by(cod_cid=cod_cid).first() filter(Cidade.cod_cid == cod_cid).first()
            if cidade:
                return {
                    'cod_cid': cidade.cod_cid,
                    'cod_uf': cidade.cod_uf,
                    'nome_cid': cidade.nome_cid,
                    'preco_unit_valor_cid': float(cidade.preco_unit_valor_cid),
                    'preco_unit_peso_cid': float(cidade.preco_unit_peso_cid),
                    "estado": cidade.cod_uf
                }
            return None
        except Exception as e:
            print(f"Erro ao buscar cidade por código: {e}")
            raise
        finally:
            session.close()
