import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productoIngredientesService } from '../services/api'
import type { Producto, Categoria, Ingrediente } from '../types'

interface Props {
  producto: Producto
  categorias: Categoria[]
  ingredientes: Ingrediente[]
  onVolver: () => void
  onActualizar: () => void
}

function DetalleProducto({ producto, categorias, ingredientes, onVolver, onActualizar }: Props) {
  const [ingredienteId, setIngredienteId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [error, setError] = useState('')

  const queryClient = useQueryClient()

  const agregarMutation = useMutation({
    mutationFn: () => productoIngredientesService.agregar(
      producto.id,
      Number(ingredienteId),
      Number(cantidad)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', String(producto.id)] })
      onActualizar()
      setIngredienteId('')
      setCantidad('')
      setError('')
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Error al agregar ingrediente')
    }
  })

  const eliminarMutation = useMutation({
    mutationFn: (ingId: number) => productoIngredientesService.eliminar(producto.id, ingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', String(producto.id)] })
      onActualizar()
    }
  })

  const handleAgregar = () => {
    if (!ingredienteId) {
      setError('Seleccioná un ingrediente')
      return
    }
    if (!cantidad || Number(cantidad) <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }
    agregarMutation.mutate()
  }

  // Ingredientes que ya tiene el producto
  const ingredientesDelProducto = producto.producto_ingredientes || []

  // Ingredientes disponibles para agregar (los que no tiene todavía)
  const ingredientesDisponibles = ingredientes.filter(
    ing => !ingredientesDelProducto.some((pi: any) => pi.ingrediente_id === ing.id)
  )

  return (
    <div>
      <button
        onClick={onVolver}
        style={{color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem'}}
      >
        ← Volver a productos
      </button>

      {/* Info del producto */}
      <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem'}}>
          {producto.nombre}
        </h2>
        <p style={{color: '#6b7280', marginBottom: '0.5rem'}}>
          <span style={{fontWeight: '500'}}>Precio:</span> ${producto.precio}
        </p>
        <p style={{color: '#6b7280', marginBottom: '0.5rem'}}>
          <span style={{fontWeight: '500'}}>Descripción:</span> {producto.descripcion || '-'}
        </p>
        <p style={{color: '#6b7280', marginBottom: '0.5rem'}}>
          <span style={{fontWeight: '500'}}>Categoría:</span> {producto.categoria?.nombre || 'Sin categoría'}
        </p>
      </div>

      {/* Ingredientes del producto */}
      <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem'}}>
        <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem'}}>
          🧂 Ingredientes
        </h3>

        {/* Lista de ingredientes actuales */}
        {ingredientesDelProducto.length === 0 ? (
          <p style={{color: '#6b7280', marginBottom: '1rem'}}>Este producto no tiene ingredientes todavía</p>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem'}}>
            <thead>
              <tr style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                <th style={{textAlign: 'left', padding: '10px 16px', color: '#6b7280', fontWeight: '600'}}>Ingrediente</th>
                <th style={{textAlign: 'left', padding: '10px 16px', color: '#6b7280', fontWeight: '600'}}>Cantidad</th>
                <th style={{textAlign: 'left', padding: '10px 16px', color: '#6b7280', fontWeight: '600'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingredientesDelProducto.map((pi: any) => {
                const ing = ingredientes.find(i => i.id === pi.ingrediente_id)
                return (
                  <tr key={pi.ingrediente_id} style={{borderBottom: '1px solid #e5e7eb'}}>
                    <td style={{padding: '12px 16px'}}>{ing?.nombre || '-'}</td>
                    <td style={{padding: '12px 16px', color: '#6b7280'}}>{pi.cantidad} {ing?.unidad_medida}</td>
                    <td style={{padding: '12px 16px'}}>
                      <button
                        onClick={() => eliminarMutation.mutate(pi.ingrediente_id)}
                        style={{backgroundColor: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer'}}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Formulario para agregar ingrediente */}
        <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '0.75rem'}}>Agregar ingrediente</h4>

        {error && (
          <p style={{color: '#ef4444', fontSize: '0.875rem', backgroundColor: '#fef2f2', padding: '8px', borderRadius: '6px', marginBottom: '0.75rem'}}>{error}</p>
        )}

        <div style={{display: 'flex', gap: '8px', alignItems: 'flex-end'}}>
          <div style={{flex: 2}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
              Ingrediente
            </label>
            <select
              value={ingredienteId}
              onChange={(e) => setIngredienteId(e.target.value)}
              style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '1rem', outline: 'none'}}
            >
              <option value="">Seleccioná un ingrediente</option>
              {ingredientesDisponibles.map(ing => (
                <option key={ing.id} value={ing.id}>
                  {ing.nombre} ({ing.unidad_medida})
                </option>
              ))}
            </select>
          </div>

          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
              Cantidad
            </label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '1rem', outline: 'none'}}
              placeholder="Ej: 500"
              min={0}
            />
          </div>

          <button
            onClick={handleAgregar}
            disabled={agregarMutation.isPending}
            style={{backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: agregarMutation.isPending ? 0.5 : 1}}
          >
            {agregarMutation.isPending ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetalleProducto