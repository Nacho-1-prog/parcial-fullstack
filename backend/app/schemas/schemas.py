from sqlmodel import SQLModel
from typing import List, Optional

# SCHEMAS DE CATEGORIA

class CategoriaCreate(SQLModel):
    nombre: str
    descripcion: Optional[str] = None

class CategoriaRead(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None

class CategoriaUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None

# SCHEMAS DE INGREDIENTE

class IngredienteCreate(SQLModel):
    nombre: str
    unidad_medida: str

class IngredienteRead(SQLModel):
    id: int
    nombre: str
    unidad_medida: str

class IngredienteUpdate(SQLModel):
    nombre: Optional[str] = None
    unidad_medida: Optional[str] = None

# SCHEMAS DE PRODUCTO

class ProductoCreate(SQLModel):
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None

class ProductoRead(SQLModel):
    id: int
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None

class ProductoIngredienteRead(SQLModel):
    ingrediente_id: int
    cantidad: float

class ProductoReadConRelaciones(SQLModel):
    id: int
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria: Optional[CategoriaRead] = None
    producto_ingredientes: List["ProductoIngredienteRead"] = []

class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    precio: Optional[float] = None
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None