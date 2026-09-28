import { createContext, useReducer } from 'react'

export const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR':
      return [...state, action.producto]

    case 'ELIMINAR':
      return state.filter((producto) => producto.id !== action.id)

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