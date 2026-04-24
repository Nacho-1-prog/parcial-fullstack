import axios from 'axios'
import type { 
  Categoria, CategoriaCreate, CategoriaUpdate,
  Ingrediente, IngredienteCreate, IngredienteUpdate,
  Producto, ProductoCreate, ProductoUpdate
} from '../types'

// URL del backend
const api = axios.create({
  baseURL: 'http://localhost:8000'
})

// SERVICIOS DE CATEGORIA

export const categoriasService = {
  getAll: async (): Promise<Categoria[]> => {
    const res = await api.get('/categorias/')
    return res.data
  },
  getOne: async (id: number): Promise<Categoria> => {
    const res = await api.get(`/categorias/${id}`)
    return res.data
  },
  create: async (data: CategoriaCreate): Promise<Categoria> => {
    const res = await api.post('/categorias/', data)
    return res.data
  },
  update: async (id: number, data: CategoriaUpdate): Promise<Categoria> => {
    const res = await api.patch(`/categorias/${id}`, data)
    return res.data
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`)
  }
}

// SERVICIOS DE INGREDIENTE

export const ingredientesService = {
  getAll: async (): Promise<Ingrediente[]> => {
    const res = await api.get('/ingredientes/')
    return res.data
  },
  getOne: async (id: number): Promise<Ingrediente> => {
    const res = await api.get(`/ingredientes/${id}`)
    return res.data
  },
  create: async (data: IngredienteCreate): Promise<Ingrediente> => {
    const res = await api.post('/ingredientes/', data)
    return res.data
  },
  update: async (id: number, data: IngredienteUpdate): Promise<Ingrediente> => {
    const res = await api.patch(`/ingredientes/${id}`, data)
    return res.data
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/ingredientes/${id}`)
  }
}

// SERVICIOS DE PRODUCTO

export const productosService = {
  getAll: async (): Promise<Producto[]> => {
    const res = await api.get('/productos/')
    return res.data
  },
  getOne: async (id: number): Promise<Producto> => {
    const res = await api.get(`/productos/${id}`)
    return res.data
  },
  create: async (data: ProductoCreate): Promise<Producto> => {
    const res = await api.post('/productos/', data)
    return res.data
  },
  update: async (id: number, data: ProductoUpdate): Promise<Producto> => {
    const res = await api.patch(`/productos/${id}`, data)
    return res.data
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`)
  }
}