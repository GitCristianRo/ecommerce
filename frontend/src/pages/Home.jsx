import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { CartContext } from '../context/CartContext'
import API_URL from "../api";

function Home() {
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
                console.error('Error al cargar los productos destacados:', error)
                setError(true)
            })
            .finally(() => {
                setCargando(false)
            })
    }, [])

    const productosDestacados = productos
        .filter((producto) => Number(producto.stock) > 0)
        .slice(0, 3)

    const formatearPrecio = (precio) => {
        return `$ ${Number(precio).toLocaleString('es-CO', {
            maximumFractionDigits: 0,
        })}`
    }

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-label">
                        TU ESTILO, TUS REGLAS
                    </span>

                    <h1>
                        Estilo que
                        <br />
                        te representa.
                    </h1>

                    <p>
                        Prendas modernas, cómodas y versátiles
                        para expresar quién eres cada día.
                    </p>

                    <Link to="/productos" className="hero-button">
                        EXPLORAR COLECCIÓN
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div
                    className="hero-image"
                    role="img"
                    aria-label="Moda urbana contemporánea"
                >
                    <span className="hero-image-caption">
                        URBAN / NUEVA TEMPORADA
                    </span>
                </div>
            </section>

            <section className="benefits">
                <article className="benefit">
                    <span className="benefit-icon">✳</span>
                    <div>
                        <h2>Estilo contemporáneo</h2>
                        <p>Prendas que expresan tu personalidad.</p>
                    </div>
                </article>

                <article className="benefit">
                    <span className="benefit-icon">↗</span>
                    <div>
                        <h2>Compra sencilla</h2>
                        <p>Encuentra tu estilo en pocos pasos.</p>
                    </div>
                </article>

                <article className="benefit">
                    <span className="benefit-icon">◇</span>
                    <div>
                        <h2>Para tu día a día</h2>
                        <p>Versatilidad para cada ocasión.</p>
                    </div>
                </article>
            </section>

            <section className="featured-products">
                <div className="featured-header">
                    <div>
                        <span className="featured-eyebrow">
                            SELECCIÓN URBAN
                        </span>

                        <h2>Encuentra tu estilo</h2>

                        <p>
                            Prendas que combinan contigo y con tu día a día.
                        </p>
                    </div>

                    <Link
                        to="/productos"
                        className="featured-view-all"
                    >
                        VER TODOS LOS PRODUCTOS →
                    </Link>
                </div>

                {cargando ? (
                    <p className="featured-message">
                        Cargando productos...
                    </p>
                ) : error ? (
                    <p className="featured-message featured-error">
                        No pudimos cargar los productos destacados.
                    </p>
                ) : productosDestacados.length === 0 ? (
                    <p className="featured-message">
                        No hay productos disponibles en este momento.
                    </p>
                ) : (
                    <div className="featured-grid">
                        {productosDestacados.map((producto) => (
                            <article
                                className="featured-card"
                                key={producto.id}
                            >
                                <div className="featured-image">
                                    {producto.imagen ? (
                                        <img
                                            src={`/images/${producto.imagen}`}
                                            alt={producto.nombre}
                                        />
                                    ) : (
                                        <div className="featured-no-image">
                                            URBAN
                                        </div>
                                    )}

                                    <span className="featured-badge">
                                        DISPONIBLE
                                    </span>
                                </div>

                                <div className="featured-info">
                                    <h3>{producto.nombre}</h3>

                                    <p className="featured-description">
                                        {producto.descripcion}
                                    </p>

                                    <p className="featured-price">
                                        {formatearPrecio(producto.precio)}
                                    </p>

                                    <button
                                        className="featured-button"
                                        disabled={Number(producto.stock) <= 0}
                                        onClick={() =>
                                            dispatch({
                                                type: 'AGREGAR',
                                                producto,
                                            })
                                        }
                                    >
                                        {Number(producto.stock) > 0
                                            ? 'AGREGAR AL CARRITO'
                                            : 'AGOTADO'}

                                        {Number(producto.stock) > 0 && (
                                            <span aria-hidden="true">→</span>
                                        )}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className="featured-bottom-link">
                    <Link to="/productos">
                        EXPLORAR TODA LA COLECCIÓN
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Home

