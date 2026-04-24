from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

# Cargamos las variables del archivo .env
load_dotenv()

# Lee la URL de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Crea todas las tablas en la base de datos"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Nos da una sesión para hablar con la base de datos"""
    with Session(engine) as session:
        yield session