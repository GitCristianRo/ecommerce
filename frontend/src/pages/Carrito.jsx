import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

function Carrito() {
    const { carrito, dispatch } = useContext(CartContext)

    return (
        <div>
            <h1>Carrito</h1>

            {carrito.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                carrito.map((producto) => (
                    <div key={producto.id}>
                        <h2>{producto.nombre}</h2>
                        <p>Precio: ${producto.precio}</p>

                        <button
                            onClick={() =>
                                dispatch({
                                    type: 'ELIMINAR',
                                    id: producto.id,
                                })
                            }
                        >
                            Eliminar
                        </button>
                    </div>
                ))
            )}
        </div>
    )
}

export default Carrito