import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { productosService, categoriasService, productoIngredientesService, ingredientesService } from '../services/api'
import type { Producto, ProductoCreate, ProductoUpdate } from '../types'
import Modal from '../components/Modal'
import DetalleProducto from '../components/DetalleProducto'

function ProductosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [error, setError] = useState('')

  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: productos, isLoading, isError } = useQuery({
    queryKey: ['productos'],
    queryFn: productosService.getAll
  })

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasService.getAll
  })

  const { data: ingredientes } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: ingredientesService.getAll
  })

  const { data: productoDetalle } = useQuery({
    queryKey: ['productos', id],
    queryFn: () => productosService.getOne(Number(id)),
    enabled: !!id
  })

  const crearMutation = useMutation({
    mutationFn: (data: ProductoCreate) => productosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      cerrarModal()
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Error al crear el producto')
    }
  })

  const editarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: ProductoUpdate }) =>
      productosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      cerrarModal()
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Error al editar el producto')
    }
  })

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => productosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    }
  })

  const abrirModalCrear = () => {
    setProductoEditando(null)
    setNombre('')
    setPrecio('')
    setDescripcion('')
    setCategoriaId('')
    setError('')
    setIsModalOpen(true)
  }

  const abrirModalEditar = (producto: Producto) => {
    setProductoEditando(producto)
    setNombre(producto.nombre)
    setPrecio(producto.precio.toString())
    setDescripcion(producto.descripcion || '')
    setCategoriaId(producto.categoria_id?.toString() || '')
    setError('')
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setProductoEditando(null)
    setNombre('')
    setPrecio('')
    setDescripcion('')
    setCategoriaId('')
    setError('')
  }

  const handleSubmit = () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    if (!precio || Number(precio) <= 0) {
      setError('El precio debe ser mayor a 0')
      return
    }
    const data = {
      nombre,
      precio: Number(precio),
      descripcion,
      categoria_id: categoriaId ? Number(categoriaId) : undefined
    }
    if (productoEditando) {
      editarMutation.mutate({ id: productoEditando.id, data })
    } else {
      crearMutation.mutate(data)
    }
  }

  const handleEliminar = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      eliminarMutation.mutate(id)
    }
  }

  // Vista detalle
  if (id && productoDetalle) {
    return (
      <DetalleProducto
        producto={productoDetalle}
        categorias={categorias || []}
        ingredientes={ingredientes || []}
        onVolver={() => navigate('/productos')}
        onActualizar={() => queryClient.invalidateQueries({ queryKey: ['productos', id] })}
      />
    )
  }

  if (isLoading) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
      <p style={{color: '#6b7280', fontSize: '1.1rem'}}>Cargando productos...</p>
    </div>
  )

  if (isError) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
      <p style={{color: '#ef4444', fontSize: '1.1rem'}}>Error al cargar los productos</p>
    </div>
  )

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>Productos</h2>
        <button
          onClick={abrirModalCrear}
          style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem'}}
        >
          + Nuevo Producto
        </button>
      </div>

      <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>ID</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Nombre</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Precio</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Categoría</th>
              <th style={{textAlign: 'left', padding: '12px 24px', color: '#6b7280', fontWeight: '600'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos?.map((producto) => (
              <tr key={producto.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                <td style={{padding: '16px 24px', color: '#6b7280'}}>{producto.id}</td>
                <td style={{padding: '16px 24px', fontWeight: '500'}}>
                  <button
                    onClick={() => navigate(`/productos/${producto.id}`)}
                    style={{color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '500'}}
                  >
                    {producto.nombre}
                  </button>
                </td>
                <td style={{padding: '16px 24px', color: '#6b7280'}}>${producto.precio}</td>
                <td style={{padding: '16px 24px', color: '#6b7280'}}>
                  {categorias?.find(c => c.id === producto.categoria_id)?.nombre || '-'}
                </td>
                <td style={{padding: '16px 24px'}}>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={() => abrirModalEditar(producto)}
                      style={{backgroundColor: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer'}}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(producto.id)}
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

        {productos?.length === 0 && (
          <p style={{textAlign: 'center', color: '#6b7280', padding: '2rem'}}>
            No hay productos todavía
          </p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        title={productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
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
              placeholder="Ej: Pizza Margherita"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
              Precio *
            </label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
              placeholder="Ej: 1500"
              min={0}
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
              placeholder="Ej: Pizza con salsa de tomate y mozzarella"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
              Categoría
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
            >
              <option value="">Sin categoría</option>
              {categorias?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
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
                : productoEditando ? 'Guardar Cambios' : 'Crear'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductosPage