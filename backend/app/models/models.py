from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

# CATEGORIA

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=50)
    descripcion: Optional[str] = Field(default=None, max_length=200)
    
    # Una categoría puede tener muchos productos (relación 1:N)
    productos: List["Producto"] = Relationship(back_populates="categoria")

# INGREDIENTE

class Ingrediente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=50)
    unidad_medida: str = Field(max_length=20)
    
    # Un ingrediente puede estar en muchos productos (relación N:N)
    producto_ingredientes: List["ProductoIngrediente"] = Relationship(back_populates="ingrediente")

# TABLA INTERMEDIA PRODUCTO-CATEGORIA (N:N)

class ProductoCategoria(SQLModel, table=True):
    producto_id: Optional[int] = Field(default=None, foreign_key="producto.id", primary_key=True)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id", primary_key=True)

# PRODUCTO

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100)
    precio: float = Field(gt=0)
    descripcion: Optional[str] = Field(default=None, max_length=300)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
    
    # Relación con Categoria (N:1)
    categoria: Optional["Categoria"] = Relationship(back_populates="productos")
    
    # Relación con ingredientes a través de la tabla intermedia (N:N)
    producto_ingredientes: List["ProductoIngrediente"] = Relationship(back_populates="producto")

# TABLA INTERMEDIA PRODUCTO-INGREDIENTE (N:N)

class ProductoIngrediente(SQLModel, table=True):
    producto_id: Optional[int] = Field(default=None, foreign_key="producto.id", primary_key=True)
    ingrediente_id: Optional[int] = Field(default=None, foreign_key="ingrediente.id", primary_key=True)
    cantidad: float = Field(gt=0)
    
    # Relaciones
    producto: Optional["Producto"] = Relationship(back_populates="producto_ingredientes")
    ingrediente: Optional["Ingrediente"] = Relationship(back_populates="producto_ingredientes")