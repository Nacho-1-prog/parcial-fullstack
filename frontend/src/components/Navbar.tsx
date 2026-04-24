import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }}>
      
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>
        🍕 Gestión de Productos
      </h1>

      <div style={{display: 'flex', gap: '1.5rem'}}>
        <NavLink
          to="/categorias"
          style={({ isActive }: { isActive: boolean }) => ({
            color: 'white',
            textDecoration: isActive ? 'underline' : 'none',
            fontWeight: isActive ? 'bold' : 'normal'
          })}
        >
          Categorías
        </NavLink>

        <NavLink
          to="/ingredientes"
          style={({ isActive }: { isActive: boolean }) => ({
            color: 'white',
            textDecoration: isActive ? 'underline' : 'none',
            fontWeight: isActive ? 'bold' : 'normal'
          })}
        >
          Ingredientes
        </NavLink>

        <NavLink
          to="/productos"
          style={({ isActive }: { isActive: boolean }) => ({
            color: 'white',
            textDecoration: isActive ? 'underline' : 'none',
            fontWeight: isActive ? 'bold' : 'normal'
          })}
        >
          Productos
        </NavLink>
      </div>

    </nav>
  )
}

export default Navbar