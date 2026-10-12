import { createContext, useReducer } from 'react'

export const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR': {
      const productoExistente = state.find(
        (producto) => producto.id === action.producto.id
      )

      if (productoExistente) {
        return state.map((producto) =>
          producto.id === action.producto.id
            ? { ...producto, cantidad: producto.cantidad + 1 }
            : producto
        )
      }

      return [
        ...state,
        {
          ...action.producto,
          cantidad: 1,
        },
      ]
    }

    case 'ELIMINAR':
      return state.filter((producto) => producto.id !== action.id)

    case 'CAMBIAR_CANTIDAD':
      return state.map((producto) =>
        producto.id === action.id
          ? {
              ...producto,
              cantidad: Math.max(1, action.cantidad),
            }
          : producto
      )

    case 'VACIAR':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [carrito, dispatch] = useReducer(cartReducer, [])

  return (
    <CartContext.Provider value={{ carrito, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}