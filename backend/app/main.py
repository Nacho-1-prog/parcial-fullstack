from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers import categorias, ingredientes, productos

app = FastAPI(
    title="API Parcial Fullstack",
    description="API para gestión de productos, categorías e ingredientes",
    version="1.0.0"
)

# CORS — Permite que el frontend se conecte

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Puerto de Vite (React)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Evento de inicio — Crea las tablas

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Registro routers

app.include_router(categorias.router)
app.include_router(ingredientes.router)
app.include_router(productos.router)

# Ruta raíz

@app.get("/")
def root():
    return {"mensaje": "API funcionando correctamente!"}