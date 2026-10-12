import { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { CartContext } from '../context/CartContext'
import API_URL from "../api";

function DetalleProducto() {
    const { id } = useParams()
    const { dispatch } = useContext(CartContext)

    const [producto, setProducto] = useState(null)
    const [cantidad, setCantidad] = useState(1)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        setCargando(true)
        setError('')
        setProducto(null)
        setCantidad(1)

        axios
            .get(`${API_URL}/api/productos/${id}`)
            .then((respuesta) => {
                setProducto(respuesta.data)
            })
            .catch((err) => {
                console.error('Error al consultar el producto:', err)
                setError('No encontramos el producto solicitado.')
            })
            .finally(() => {
                setCargando(false)
            })
    }, [id])

    const formatoPrecio = (precio) =>
        new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(precio)

    function agregarAlCarrito() {
        if (!producto || Number(producto.stock) <= 0) {
            return
        }

        if (cantidad > Number(producto.stock)) {
            setMensaje('No hay suficientes unidades disponibles.')
            return
        }

        dispatch({
            type: 'AGREGAR',
            producto: {
                ...producto,
                cantidad,
            },
        })

        setMensaje('Producto agregado al carrito correctamente.')
    }

    if (cargando) {
        return (
            <div className="detalle-estado">
                <p>Cargando producto...</p>
            </div>
        )
    }

    if (error || !producto) {
        return (
            <div className="detalle-estado">
                <h2>Producto no disponible</h2>
                <p>{error || 'No encontramos el producto solicitado.'}</p>
                <Link to="/productos" className="detalle-volver">
                    VOLVER AL CATÁLOGO
                </Link>
            </div>
        )
    }

    const stock = Number(producto.stock)
    const agotado = stock <= 0

    return (
        <main className="detalle-pagina">
            <Link to="/productos" className="detalle-regresar">
                ← Volver al catálogo
            </Link>

            <section className="detalle-contenido">
                <div className="detalle-imagen">
                    {producto.imagen ? (
                        <img
                            src={`/images/${producto.imagen}`}
                            alt={producto.nombre}
                        />
                    ) : (
                        <div className="detalle-sin-imagen">URBAN</div>
                    )}
                </div>

                <div className="detalle-informacion">
                    <span className="detalle-etiqueta">COLECCIÓN URBAN</span>

                    <h1>{producto.nombre}</h1>

                    <p className="detalle-precio">
                        {formatoPrecio(producto.precio)}
                    </p>

                    <p className="detalle-descripcion">
                        {producto.descripcion}
                    </p>

                    <div
                        className={`detalle-stock ${
                            agotado ? 'sin-stock' : 'con-stock'
                        }`}
                    >
                        {agotado
                            ? 'Producto agotado'
                            : `${stock} unidades disponibles`}
                    </div>

                    {!agotado && (
                        <>
                            <div className="detalle-selector">
                                <label htmlFor="cantidadProducto">
                                    Cantidad
                                </label>

                                <div className="detalle-controles">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCantidad((actual) =>
                                                Math.max(1, actual - 1)
                                            )
                                        }
                                        disabled={cantidad <= 1}
                                        aria-label="Disminuir cantidad"
                                    >
                                        −
                                    </button>

                                    <span>{cantidad}</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCantidad((actual) =>
                                                Math.min(stock, actual + 1)
                                            )
                                        }
                                        disabled={cantidad >= stock}
                                        aria-label="Aumentar cantidad"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="detalle-agregar"
                                onClick={agregarAlCarrito}
                            >
                                AGREGAR AL CARRITO
                            </button>
                        </>
                    )}

                    {agotado && (
                        <button
                            type="button"
                            className="detalle-agregar"
                            disabled
                        >
                            PRODUCTO AGOTADO
                        </button>
                    )}

                    {mensaje && (
                        <p className="detalle-mensaje" role="status">
                            {mensaje}
                        </p>
                    )}

                    <p className="detalle-nota">
                        Prendas seleccionadas para acompañar tu estilo.
                    </p>
                </div>
            </section>
        </main>
    )
}

export default DetalleProducto