
// TIPOS DE CATEGORIA

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string 
}

export interface CategoriaCreate {
  nombre: string
  descripcion?: string
}

export interface CategoriaUpdate {
  nombre?: string
  descripcion?: string
}

// TIPOS DE INGREDIENTE

export interface Ingrediente {
  id: number
  nombre: string
  unidad_medida: string
}

export interface IngredienteCreate {
  nombre: string
  unidad_medida: string
}

export interface IngredienteUpdate {
  nombre?: string
  unidad_medida?: string
}

// TIPOS DE PRODUCTO

export interface Producto {
  id: number
  nombre: string
  precio: number
  descripcion?: string
  categoria_id?: number
  categoria?: Categoria  // Relación con categoría
}

export interface ProductoCreate {
  nombre: string
  precio: number
  descripcion?: string
  categoria_id?: number
}

export interface ProductoUpdate {
  nombre?: string
  precio?: number
  descripcion?: string
  categoria_id?: number
}