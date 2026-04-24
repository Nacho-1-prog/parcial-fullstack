import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriasService } from '../services/api'
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types'
import Modal from '../components/Modal'

function CategoriasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  const queryClient = useQueryClient()

  const { data: categorias, isLoading, isError } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasService.getAll
  })

  const crearMutation = useMutation({
    mutationFn: (data: CategoriaCreate) => categoriasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      cerrarModal()
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Error al crear la categoría')
    }
  })

  const editarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: CategoriaUpdate }) =>
      categoriasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      cerrarModal()
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Error al editar la categoría')
    }
  })

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => categoriasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    }
  })

  const abrirModalCrear = () => {
    setCategoriaEditando(null)
    setNombre('')
    setDescripcion('')
    setError('')
    setIsModalOpen(true)
  }

  const abrirModalEditar = (categoria: Categoria) => {
    setCategoriaEditando(categoria)
    setNombre(categoria.nombre)
    setDescripcion(categoria.descripcion || '')
    setError('')
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setCategoriaEditando(null)
    setNombre('')
    setDescripcion('')
    setError('')
  }

  const handleSubmit = () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    if (categoriaEditando) {
      editarMutation.mutate({ id: categoriaEditando.id, data: { nombre, descripcion } })
    } else {
      crearMutation.mutate({ nombre, descripcion })
    }
  }

  const handleEliminar = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      eliminarMutation.mutate(id)
    }
  }

  if (isLoading) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
      <p style={{color: '#6b7280', fontSize: '1.1rem'}}>Cargando categorías...</p>
    </div>
  )

  if (isError) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
      <p style={{color: '#ef4444', fontSize: '1.1rem'}}>Error al cargar las categorías</p>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>Categorías</h2>
        <button
          onClick={abrirModalCrear}
          style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem'}}
        >
          + Nueva Categoría
        </button>
      </div>

      {/* Tabla */}
      <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>ID</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Nombre</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Descripción</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias?.map((categoria) => (
              <tr key={categoria.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                <td style={{padding: '16px 24px', color: '#6b7280'}}>{categoria.id}</td>
                <td style={{padding: '16px 24px', fontWeight: '500'}}>{categoria.nombre}</td>
                <td style={{padding: '16px 24px', color: '#6b7280'}}>{categoria.descripcion || '-'}</td>
                <td style={{padding: '16px 24px'}}>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={() => abrirModalEditar(categoria)}
                      style={{backgroundColor: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer'}}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(categoria.id)}
                      style={{backgroundColor: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer'}}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categorias?.length === 0 && (
          <p style={{textAlign: 'center', color: '#6b7280', padding: '2rem'}}>
            No hay categorías todavía
          </p>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        title={categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {error && (
            <p style={{color: '#ef4444', fontSize: '0.875rem', backgroundColor: '#fef2f2', padding: '8px', borderRadius: '6px'}}>{error}</p>
          )}

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
              Nombre *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
              placeholder="Ej: Pizzas"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', minHeight: '80px'}}
              placeholder="Ej: Pizzas artesanales"
            />
          </div>

          <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
            <button
              onClick={cerrarModal}
              style={{padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#6b7280', cursor: 'pointer', backgroundColor: 'white'}}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={crearMutation.isPending || editarMutation.isPending}
              style={{padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: crearMutation.isPending || editarMutation.isPending ? 0.5 : 1}}
            >
              {crearMutation.isPending || editarMutation.isPending
                ? 'Guardando...'
                : categoriaEditando ? 'Guardar Cambios' : 'Crear'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CategoriasPage