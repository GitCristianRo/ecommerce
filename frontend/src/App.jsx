import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useContext } from 'react'

import Home from './pages/Home'
import Productos from './pages/Productos'
import Carrito from './pages/Carrito'
import { CartProvider, CartContext } from './context/CartContext'
import DetalleProducto from './pages/DetalleProducto'
import AdminPedidos from './pages/admin/AdminPedidos'

import './App.css'

function Navbar() {
    const { carrito } = useContext(CartContext)

    const cantidadProductos = carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
    )

    return (
        <header className="navbar">
            <Link to="/" className="navbar-logo">
                <span className="logo-name">URBAN</span>
                <span className="logo-tagline">WEAR YOUR STORY</span>
            </Link>

            <nav className="navbar-links">
                <Link to="/" className="navbar-link">
                    Inicio
                </Link>

                <Link to="/productos" className="navbar-link">
                    Productos
                </Link>

                <Link to="/carrito" className="navbar-link navbar-cart">
                    Carrito
                    <span className="cart-count">
                        {cantidadProductos}
                    </span>
                </Link>
                <Link to="/admin/pedidos" className="navbar-link">
                    Admin
                </Link>
            </nav>
        </header>
    )
}

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Navbar />

                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/productos/:id" element={<DetalleProducto />} />
                        <Route path="/carrito" element={<Carrito />} />
                        <Route path="/admin/pedidos" element={<AdminPedidos />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </CartProvider>
    )
}

export default App

