from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select
from typing import Annotated, List
from app.database import get_session
from app.models.models import Categoria
from app.schemas.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate

router = APIRouter(prefix="/categorias", tags=["Categorias"])

SessionDep = Annotated[Session, Depends(get_session)]

# GET /categorias — Listar todas

@router.get("/", response_model=List[CategoriaRead])
def listar_categorias(
    session: SessionDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 10,
    nombre: Annotated[str | None, Query()] = None
):
    """
    Devuelve todas las categorías.
    Tiene paginación (offset y limit) y filtro por nombre.
    """
    query = select(Categoria)
    
    # Si el usuario manda un nombre, filtra por ese nombre
    if nombre:
        query = query.where(Categoria.nombre.contains(nombre))
    
    categorias = session.exec(query.offset(offset).limit(limit)).all()
    return categorias


# GET /categorias/{id} — Ver una sola

@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, session: SessionDep):
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria


# POST /categorias — Crear una nueva

@router.post("/", response_model=CategoriaRead, status_code=201)
def crear_categoria(categoria: CategoriaCreate, session: SessionDep):
    
    # Verifica si ya existe una categoría con ese nombre
    existe = session.exec(
        select(Categoria).where(Categoria.nombre == categoria.nombre)
    ).first()
    
    if existe:
        raise HTTPException(
            status_code=400,
            detail=f"Ya existe una categoría con el nombre '{categoria.nombre}'"
        )
    
    nueva_categoria = Categoria.model_validate(categoria)
    session.add(nueva_categoria)
    session.commit()
    session.refresh(nueva_categoria)
    return nueva_categoria


# PATCH /categorias/{id} — Editar una

@router.patch("/{categoria_id}", response_model=CategoriaRead)
def editar_categoria(categoria_id: int, categoria: CategoriaUpdate, session: SessionDep):
    categoria_db = session.get(Categoria, categoria_id)
    if not categoria_db:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Solo actualizamos los campos que el usuario mandó
    datos = categoria.model_dump(exclude_unset=True)
    categoria_db.sqlmodel_update(datos)
    session.commit()
    session.refresh(categoria_db)
    return categoria_db


# DELETE /categorias/{id} — Eliminar una

@router.delete("/{categoria_id}", status_code=204)
def eliminar_categoria(categoria_id: int, session: SessionDep):
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    session.delete(categoria)
    session.commit()