import { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

function Productos() {
  const { dispatch } = useContext(CartContext)
  const [productos, setProductos] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/productos')
      .then((response) => {
        setProductos(response.data)
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error)
      })
  }, [])

  return (
    <div>
      <h1>Productos</h1>

      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        productos.map((producto) => (
          <div key={producto.id}>
            <h2>{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Stock: {producto.stock}</p>

            <button
              onClick={() =>
                dispatch({
                  type: 'AGREGAR',
                  producto: producto,
                })
              }
            >
              Agregar al carrito
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default Productos