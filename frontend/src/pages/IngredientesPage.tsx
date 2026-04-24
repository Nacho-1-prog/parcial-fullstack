import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ingredientesService } from '../services/api'
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '../types'
import Modal from '../components/Modal'

function IngredientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ingredienteEditando, setIngredienteEditando] = useState<Ingrediente | null>(null)
  const [nombre, setNombre] = useState('')
  const [unidadMedida, setUnidadMedida] = useState('')
  const [error, setError] = useState('')

  const queryClient = useQueryClient()

  const { data: ingredientes, isLoading, isError } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: ingredientesService.getAll
  })

  const crearMutation = useMutation({
    mutationFn: (data: IngredienteCreate) => ingredientesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      cerrarModal()
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Error al crear el ingrediente')
    }
  })

  const editarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: IngredienteUpdate }) =>
      ingredientesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      cerrarModal()
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Error al editar el ingrediente')
    }
  })

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => ingredientesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
    }
  })

  const abrirModalCrear = () => {
    setIngredienteEditando(null)
    setNombre('')
    setUnidadMedida('')
    setError('')
    setIsModalOpen(true)
  }

  const abrirModalEditar = (ingrediente: Ingrediente) => {
    setIngredienteEditando(ingrediente)
    setNombre(ingrediente.nombre)
    setUnidadMedida(ingrediente.unidad_medida)
    setError('')
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setIngredienteEditando(null)
    setNombre('')
    setUnidadMedida('')
    setError('')
  }

  const handleSubmit = () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    if (!unidadMedida.trim()) {
      setError('La unidad de medida es obligatoria')
      return
    }
    if (ingredienteEditando) {
      editarMutation.mutate({ id: ingredienteEditando.id, data: { nombre, unidad_medida: unidadMedida } })
    } else {
      crearMutation.mutate({ nombre, unidad_medida: unidadMedida })
    }
  }

  const handleEliminar = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este ingrediente?')) {
      eliminarMutation.mutate(id)
    }
  }

  if (isLoading) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
      <p style={{color: '#6b7280', fontSize: '1.1rem'}}>Cargando ingredientes...</p>
    </div>
  )

  if (isError) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
      <p style={{color: '#ef4444', fontSize: '1.1rem'}}>Error al cargar los ingredientes</p>
    </div>
  )

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>Ingredientes</h2>
        <button
          onClick={abrirModalCrear}
          style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem'}}
        >
          + Nuevo Ingrediente
        </button>
      </div>

      <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>ID</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Nombre</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Unidad de Medida</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes?.map((ingrediente) => (
              <tr key={ingrediente.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                <td style={{padding: '16px 24px', color: '#6b7280'}}>{ingrediente.id}</td>
                <td style={{padding: '16px 24px', fontWeight: '500'}}>{ingrediente.nombre}</td>
                <td style={{padding: '16px 24px', color: '#6b7280'}}>{ingrediente.unidad_medida}</td>
                <td style={{padding: '16px 24px'}}>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={() => abrirModalEditar(ingrediente)}
                      style={{backgroundColor: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer'}}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(ingrediente.id)}
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

        {ingredientes?.length === 0 && (
          <p style={{textAlign: 'center', color: '#6b7280', padding: '2rem'}}>
            No hay ingredientes todavía
          </p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        title={ingredienteEditando ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
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
              placeholder="Ej: Harina"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
              Unidad de Medida *
            </label>
            <select
              value={unidadMedida}
              onChange={(e) => setUnidadMedida(e.target.value)}
              style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
            >
              <option value="">Seleccioná una unidad</option>
              <option value="kg">Kilogramos (kg)</option>
              <option value="g">Gramos (g)</option>
              <option value="l">Litros (l)</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="unidad">Unidad</option>
            </select>
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
                : ingredienteEditando ? 'Guardar Cambios' : 'Crear'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default IngredientesPage