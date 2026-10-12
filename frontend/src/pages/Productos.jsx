import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { CartContext } from '../context/CartContext'
import { Link } from 'react-router-dom'
import API_URL from "../api";

function Productos() {
    const { dispatch } = useContext(CartContext)

    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        axios
            .get(`${API_URL}/api/productos`)
            .then((response) => {
                setProductos(response.data)
            })
            .catch((error) => {
                console.error('Error al obtener los productos:', error)
                setError(true)
            })
            .finally(() => {
                setCargando(false)
            })
    }, [])

    return (
        <main className="productos-page">
            <section className="productos-header">
                <span className="productos-eyebrow">
                    DESCUBRE TU ESTILO
                </span>

                <h1>Nuestra colección</h1>

                <p>
                    Prendas versátiles para expresarte
                    a tu manera, todos los días.
                </p>

                {!cargando && !error && (
                    <span className="productos-total">
                        {productos.length}{' '}
                        {productos.length === 1
                            ? 'producto disponible'
                            : 'productos disponibles'}
                    </span>
                )}
            </section>

            {cargando ? (
                <p className="productos-mensaje">
                    Cargando nuestra colección...
                </p>
            ) : error ? (
                <p className="productos-mensaje productos-error">
                    No pudimos cargar los productos.
                    Intenta nuevamente más tarde.
                </p>
            ) : productos.length === 0 ? (
                <p className="productos-mensaje">
                    No hay productos disponibles por el momento.
                </p>
            ) : (
                <section className="productos-grid">
                    {productos.map((producto) => (
                        <article
                            className="producto-card"
                            key={producto.id}
                        >
                            <Link
                                to={`/productos/${producto.id}`}
                                className="producto-enlace"
                            >
                                <div className="producto-imagen">
                                    {producto.imagen ? (
                                        <img
                                            src={`/images/${producto.imagen}`}
                                            alt={producto.nombre}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="producto-sin-imagen">
                                            <span>URBAN</span>
                                            <span>Imagen no disponible</span>
                                        </div>
                                    )}

                                    <span
                                        className={`producto-etiqueta ${
                                            Number(producto.stock) <= 0
                                                ? 'producto-etiqueta-agotado'
                                                : ''
                                        }`}
                                    >
                                        {Number(producto.stock) > 0
                                            ? 'DISPONIBLE'
                                            : 'AGOTADO'}
                                    </span>
                                </div>

                                <div className="producto-info">
                                    <h2>{producto.nombre}</h2>

                                    <p className="producto-descripcion">
                                        {producto.descripcion}
                                    </p>

                                    <p className="producto-precio">
                                        {new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            maximumFractionDigits: 0,
                                        }).format(producto.precio)}
                                    </p>

                                    <p className="producto-stock">
                                        {Number(producto.stock) > 0
                                            ? `${producto.stock} unidades disponibles`
                                            : 'Agotado'}
                                    </p>
                                </div>
                            </Link>

                            <button
                                className="producto-boton"
                                disabled={Number(producto.stock) <= 0}
                                onClick={() =>
                                    dispatch({
                                        type: 'AGREGAR',
                                        producto: producto,
                                    })
                                }
                            >
                                {Number(producto.stock) > 0
                                    ? 'AGREGAR AL CARRITO'
                                    : 'AGOTADO'}
                            </button>
                        </article>
                    ))}
                </section>
            )}
        </main>
    )
}

export default Productos

