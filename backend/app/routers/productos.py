from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select
from typing import Annotated, List
from app.database import get_session
from app.models.models import Producto, ProductoIngrediente
from app.schemas.schemas import ProductoCreate, ProductoRead, ProductoUpdate, ProductoReadConRelaciones

router = APIRouter(prefix="/productos", tags=["Productos"])

SessionDep = Annotated[Session, Depends(get_session)]

# GET /productos — Listar todos

@router.get("/", response_model=List[ProductoRead])
def listar_productos(
    session: SessionDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 10,
    nombre: Annotated[str | None, Query()] = None,
    categoria_id: Annotated[int | None, Query()] = None
):
    query = select(Producto)
    if nombre:
        query = query.where(Producto.nombre.contains(nombre))
    if categoria_id:
        query = query.where(Producto.categoria_id == categoria_id)
    productos = session.exec(query.offset(offset).limit(limit)).all()
    return productos


# GET /productos/{id} — Ver uno con relaciones

@router.get("/{producto_id}", response_model=ProductoReadConRelaciones)
def obtener_producto(producto_id: int, session: SessionDep):
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


# POST /productos — Crear uno nuevo

@router.post("/", response_model=ProductoRead, status_code=201)
def crear_producto(producto: ProductoCreate, session: SessionDep):
    nuevo_producto = Producto.model_validate(producto)
    session.add(nuevo_producto)
    session.commit()
    session.refresh(nuevo_producto)
    return nuevo_producto


# PATCH /productos/{id} — Editar uno

@router.patch("/{producto_id}", response_model=ProductoRead)
def editar_producto(producto_id: int, producto: ProductoUpdate, session: SessionDep):
    producto_db = session.get(Producto, producto_id)
    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    datos = producto.model_dump(exclude_unset=True)
    producto_db.sqlmodel_update(datos)
    session.commit()
    session.refresh(producto_db)
    return producto_db


# DELETE /productos/{id} — Eliminar uno

@router.delete("/{producto_id}", status_code=204)
def eliminar_producto(producto_id: int, session: SessionDep):
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    session.delete(producto)
    session.commit()


# POST /productos/{id}/ingredientes — Agregar ingrediente a producto

@router.post("/{producto_id}/ingredientes/{ingrediente_id}", status_code=201)
def agregar_ingrediente(
    producto_id: int,
    ingrediente_id: int,
    cantidad: Annotated[float, Query(gt=0)],
    session: SessionDep
):
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Verificamos si ya existe esa relación
    existe = session.get(ProductoIngrediente, (producto_id, ingrediente_id))
    if existe:
        raise HTTPException(status_code=400, detail="Este ingrediente ya fue agregado al producto")
    
    relacion = ProductoIngrediente(
        producto_id=producto_id,
        ingrediente_id=ingrediente_id,
        cantidad=cantidad
    )
    session.add(relacion)
    session.commit()
    return {"mensaje": "Ingrediente agregado con éxito"}

# DELETE /productos/{id}/ingredientes/{ingrediente_id}

@router.delete("/{producto_id}/ingredientes/{ingrediente_id}", status_code=204)
def eliminar_ingrediente_de_producto(
    producto_id: int,
    ingrediente_id: int,
    session: SessionDep
):
    relacion = session.get(ProductoIngrediente, (producto_id, ingrediente_id))
    if not relacion:
        raise HTTPException(status_code=404, detail="Relación no encontrada")
    session.delete(relacion)
    session.commit()