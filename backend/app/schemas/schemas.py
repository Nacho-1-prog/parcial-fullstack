from sqlmodel import SQLModel
from typing import Optional

# SCHEMAS DE CATEGORIA

class CategoriaCreate(SQLModel):
    """Lo que el usuario manda para CREAR una categoría"""
    nombre: str
    descripcion: Optional[str] = None

class CategoriaRead(SQLModel):
    """Lo que la API devuelve cuando MUESTRA una categoría"""
    id: int
    nombre: str
    descripcion: Optional[str] = None

class CategoriaUpdate(SQLModel):
    """Lo que el usuario manda para EDITAR una categoría"""
    nombre: Optional[str] = None
    descripcion: Optional[str] = None

# SCHEMAS DE INGREDIENTE

class IngredienteCreate(SQLModel):
    """Lo que el usuario manda para CREAR un ingrediente"""
    nombre: str
    unidad_medida: str

class IngredienteRead(SQLModel):
    """Lo que la API devuelve cuando MUESTRA un ingrediente"""
    id: int
    nombre: str
    unidad_medida: str

class IngredienteUpdate(SQLModel):
    """Lo que el usuario manda para EDITAR un ingrediente"""
    nombre: Optional[str] = None
    unidad_medida: Optional[str] = None

# SCHEMAS DE PRODUCTO

class ProductoCreate(SQLModel):
    """Lo que el usuario manda para CREAR un producto"""
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None

class ProductoRead(SQLModel):
    """Lo que la API devuelve cuando MUESTRA un producto"""
    id: int
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None

class ProductoReadConRelaciones(SQLModel):
    """Muestra el producto CON su categoría y sus ingredientes"""
    id: int
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria: Optional[CategoriaRead] = None

class ProductoUpdate(SQLModel):
    """Lo que el usuario manda para EDITAR un producto"""
    nombre: Optional[str] = None
    precio: Optional[float] = None
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None