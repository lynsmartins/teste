from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Base para modelos
Base = declarative_base()

class DatabaseManager:
    def __init__(self):
        """Inicializa o gerenciador de conexão com o banco de dados."""
        self.database_url = "postgresql://postgres:pucca123@localhost:5432/transporte"
        self.engine = create_engine(self.database_url)
        self.Session = sessionmaker(bind=self.engine)

    def get_database_url(self):
        return self.database_url
    
    def get_session(self):
        """Retorna uma nova sessão para interagir com o banco."""
        return self.Session()

    def execute_query(self, query, params=None):
        """Executa uma consulta diretamente no banco."""
        with self.engine.connect() as connection:
            result = connection.execute(text(query), params or {})
            return result

    def close(self):
        """Fecha o engine do banco de dados."""
        self.engine.dispose()