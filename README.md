Parcial Fullstack - Gestión de Productos

Aplicación Fullstack para gestión de productos, categorías e ingredientes.
Desarrollada con FastAPI + React + PostgreSQL.

 Video de presentación


Tecnologías utilizadas

Backend:
- FastAPI
- SQLModel
- PostgreSQL
- Python 3.11

Frontend:
- React 19
- TypeScript
- TanStack Query
- React Router DOM
- Vite

Cómo correr el proyecto

Backend

```bash
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload
```

Frontend

```bash
cd frontend
npm run dev
```

Estructura del proyecto

parcial-fullstack/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
└── frontend/
└── src/
├── components/
├── pages/
├── services/
└── types/

Funcionalidades

- CRUD completo de Categorías, Ingredientes y Productos
- Relaciones entre entidades (Producto pertenece a una Categoría)
- Validaciones en backend con Pydantic y en frontend
- Navegación con rutas dinámicas (/productos/:id)
- Estado del servidor con TanStack Query