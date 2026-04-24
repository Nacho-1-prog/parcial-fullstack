from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select
from typing import Annotated, List
from app.database import get_session
from app.models.models import Ingrediente
from app.schemas.schemas import IngredienteCreate, IngredienteRead, IngredienteUpdate

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

SessionDep = Annotated[Session, Depends(get_session)]

# GET /ingredientes — Listar todos

@router.get("/", response_model=List[IngredienteRead])
def listar_ingredientes(
    session: SessionDep,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(le=100)] = 10,
    nombre: Annotated[str | None, Query()] = None
):
    query = select(Ingrediente)
    if nombre:
        query = query.where(Ingrediente.nombre.contains(nombre))
    ingredientes = session.exec(query.offset(offset).limit(limit)).all()
    return ingredientes


# GET /ingredientes/{id} — Ver uno solo

@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def obtener_ingrediente(ingrediente_id: int, session: SessionDep):
    ingrediente = session.get(Ingrediente, ingrediente_id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente


# POST /ingredientes — Crear uno nuevo

@router.post("/", response_model=IngredienteRead, status_code=201)
@router.post("/", response_model=IngredienteRead, status_code=201)
def crear_ingrediente(ingrediente: IngredienteCreate, session: SessionDep):
    # Verifica si ya existe un ingrediente con ese nombre
    existe = session.exec(
        select(Ingrediente).where(Ingrediente.nombre == ingrediente.nombre)
    ).first()
    
    if existe:
        raise HTTPException(
            status_code=400,
            detail=f"Ya existe un ingrediente con el nombre '{ingrediente.nombre}'"
        )
    
    nuevo_ingrediente = Ingrediente.model_validate(ingrediente)
    session.add(nuevo_ingrediente)
    session.commit()
    session.refresh(nuevo_ingrediente)
    return nuevo_ingrediente


# PATCH /ingredientes/{id} — Editar uno

@router.patch("/{ingrediente_id}", response_model=IngredienteRead)
def editar_ingrediente(ingrediente_id: int, ingrediente: IngredienteUpdate, session: SessionDep):
    ingrediente_db = session.get(Ingrediente, ingrediente_id)
    if not ingrediente_db:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    datos = ingrediente.model_dump(exclude_unset=True)
    ingrediente_db.sqlmodel_update(datos)
    session.commit()
    session.refresh(ingrediente_db)
    return ingrediente_db


# DELETE /ingredientes/{id} — Eliminar uno

@router.delete("/{ingrediente_id}", status_code=204)
def eliminar_ingrediente(ingrediente_id: int, session: SessionDep):
    ingrediente = session.get(Ingrediente, ingrediente_id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    session.delete(ingrediente)
    session.commit()