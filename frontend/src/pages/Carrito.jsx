import { useContext, useState } from 'react'
import axios from 'axios'
import { CartContext } from '../context/CartContext'

function Carrito() {
    const { carrito, dispatch } = useContext(CartContext)

    const [cliente, setCliente] = useState({
        nombreCliente: '',
        emailCliente: '',
        telefonoCliente: '',
        direccion: '',
    })

    const [enviando, setEnviando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')
    const [pedidoRegistrado, setPedidoRegistrado] = useState(null)

    const total = carrito.reduce(
        (acumulado, producto) =>
            acumulado + producto.precio * producto.cantidad,
        0
    )

    const formatoPrecio = (valor) =>
        new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(valor)

    function manejarCambio(evento) {
        const { name, value } = evento.target

        setPedidoRegistrado(null)
        setMensaje('')
        setError('')

        setCliente((anterior) => ({
            ...anterior,
            [name]: value,
        }))
    }

    async function confirmarPedido(evento) {
        evento.preventDefault()

        setMensaje('')
        setError('')

        if (carrito.length === 0) {
            setError(
                'Agrega al menos un producto antes de confirmar el pedido.'
            )
            return
        }

        const datosPedido = {
            ...cliente,
            productos: carrito.map((producto) => ({
                productoId: producto.id,
                cantidad: producto.cantidad,
            })),
        }

        try {
            setEnviando(true)

            const respuesta = await axios.post(
                'http://localhost:8080/api/pedidos',
                datosPedido
            )

            dispatch({ type: 'VACIAR' })

            setCliente({
                nombreCliente: '',
                emailCliente: '',
                telefonoCliente: '',
                direccion: '',
            })

            setPedidoRegistrado(respuesta.data.id)
            setMensaje('')

        } catch (err) {
            console.error('Error al registrar el pedido:', err)

            if (err.response?.data) {
                const detalle = err.response.data

                if (typeof detalle === 'string') {
                    setError(detalle)
                } else if (detalle.mensaje) {
                    setError(detalle.mensaje)
                } else if (detalle.message) {
                    setError(detalle.message)
                } else {
                    setError(
                        'No se pudo registrar el pedido. Verifica los datos y la disponibilidad de los productos.'
                    )
                }
            } else {
                setError(
                    'No fue posible conectar con el servidor. Comprueba que Spring Boot esté ejecutándose.'
                )
            }
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="carrito-pagina">
            <div className="carrito-encabezado">
                <span className="carrito-etiqueta">TU SELECCIÓN</span>
                <h1>Tu carrito</h1>
                <p>Revisa tus prendas antes de finalizar tu compra.</p>
            </div>

            {carrito.length === 0 ? (
                <div className="carrito-vacio">
                    <div className="carrito-vacio-icono">🛍️</div>
                    <h2>Tu carrito está vacío</h2>
                    <p>
                        Parece que todavía no has encontrado tus próximas
                        prendas favoritas.
                    </p>
                    <a href="/productos" className="carrito-volver">
                        EXPLORAR PRODUCTOS
                    </a>
                </div>
            ) : (
                <div className="carrito-layout">
                    <section className="carrito-productos">
                        <div className="carrito-seccion-encabezado">
                            <h2>Productos seleccionados</h2>
                            <span>
                                {carrito.reduce(
                                    (cantidad, producto) =>
                                        cantidad + producto.cantidad,
                                    0
                                )}{' '}
                                prendas
                            </span>
                        </div>

                        {carrito.map((producto) => (
                            <article
                                className="carrito-producto"
                                key={producto.id}
                            >
                                <div className="carrito-producto-imagen">
                                    {producto.imagen ? (
                                        <img
                                            src={`/images/${producto.imagen}`}
                                            alt={producto.nombre}
                                        />
                                    ) : (
                                        <div className="carrito-sin-imagen">
                                            URBAN
                                        </div>
                                    )}
                                </div>

                                <div className="carrito-producto-info">
                                    <h3>{producto.nombre}</h3>

                                    <p className="carrito-producto-descripcion">
                                        {producto.descripcion ||
                                            'Prenda de la colección URBAN'}
                                    </p>

                                    <p className="carrito-precio-unitario">
                                        {formatoPrecio(producto.precio)}{' '}
                                        <span>por unidad</span>
                                    </p>

                                    <button
                                        type="button"
                                        className="carrito-eliminar"
                                        onClick={() =>
                                            dispatch({
                                                type: 'ELIMINAR',
                                                id: producto.id,
                                            })
                                        }
                                        disabled={enviando}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                                <div className="carrito-producto-final">
                                    <div className="carrito-cantidad">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                dispatch({
                                                    type: 'CAMBIAR_CANTIDAD',
                                                    id: producto.id,
                                                    cantidad:
                                                        producto.cantidad - 1,
                                                })
                                            }
                                            disabled={
                                                producto.cantidad <= 1 ||
                                                enviando
                                            }
                                            aria-label={`Disminuir cantidad de ${producto.nombre}`}
                                        >
                                            −
                                        </button>

                                        <span>{producto.cantidad}</span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                dispatch({
                                                    type: 'CAMBIAR_CANTIDAD',
                                                    id: producto.id,
                                                    cantidad:
                                                        producto.cantidad + 1,
                                                })
                                            }
                                            disabled={enviando}
                                            aria-label={`Aumentar cantidad de ${producto.nombre}`}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="carrito-subtotal">
                                        {formatoPrecio(
                                            producto.precio *
                                                producto.cantidad
                                        )}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </section>

                    <aside className="carrito-resumen">
                        <h2>Resumen de compra</h2>

                        <div className="carrito-resumen-linea">
                            <span>Subtotal</span>
                            <span>{formatoPrecio(total)}</span>
                        </div>

                        <div className="carrito-resumen-linea">
                            <span>Envío</span>
                            <span className="carrito-envio-pendiente">
                                Por confirmar
                            </span>
                        </div>

                        <div className="carrito-resumen-total">
                            <span>Total de productos</span>
                            <strong>{formatoPrecio(total)}</strong>
                        </div>

                        <p className="carrito-nota-envio">
                            El costo del envío, si aplica, deberá confirmarse
                            antes de finalizar la compra.
                        </p>

                        <div className="carrito-formulario-encabezado">
                            <h3>Datos de entrega</h3>
                            <p>Completa tus datos para registrar el pedido.</p>
                        </div>

                        <form
                            className="carrito-formulario"
                            onSubmit={confirmarPedido}
                        >
                            <div className="carrito-campo">
                                <label htmlFor="nombreCliente">
                                    Nombre completo
                                </label>
                                <input
                                    id="nombreCliente"
                                    name="nombreCliente"
                                    type="text"
                                    value={cliente.nombreCliente}
                                    onChange={manejarCambio}
                                    maxLength={100}
                                    required
                                    disabled={enviando}
                                />
                            </div>

                            <div className="carrito-campo">
                                <label htmlFor="emailCliente">
                                    Correo electrónico
                                </label>
                                <input
                                    id="emailCliente"
                                    name="emailCliente"
                                    type="email"
                                    value={cliente.emailCliente}
                                    onChange={manejarCambio}
                                    required
                                    disabled={enviando}
                                />
                            </div>

                            <div className="carrito-campo">
                                <label htmlFor="telefonoCliente">
                                    Teléfono
                                </label>
                                <input
                                    id="telefonoCliente"
                                    name="telefonoCliente"
                                    type="tel"
                                    value={cliente.telefonoCliente}
                                    onChange={manejarCambio}
                                    pattern="[0-9]{7,15}"
                                    title="Ingresa entre 7 y 15 dígitos."
                                    required
                                    disabled={enviando}
                                />
                            </div>

                            <div className="carrito-campo">
                                <label htmlFor="direccion">
                                    Dirección de entrega
                                </label>
                                <input
                                    id="direccion"
                                    name="direccion"
                                    type="text"
                                    value={cliente.direccion}
                                    onChange={manejarCambio}
                                    maxLength={200}
                                    required
                                    disabled={enviando}
                                />
                            </div>

                            <button
                                type="submit"
                                className="carrito-confirmar"
                                disabled={enviando}
                            >
                                {enviando
                                    ? 'REGISTRANDO PEDIDO...'
                                    : 'CONFIRMAR PEDIDO'}
                            </button>
                        </form>
                    </aside>
                </div>
            )}

            {pedidoRegistrado !== null && (
                <section className="pedido-confirmacion" role="status">
                    <div className="pedido-confirmacion-icono" aria-hidden="true">
                        ✓
                    </div>

                    <span className="pedido-confirmacion-etiqueta">
                        PEDIDO REGISTRADO
                    </span>

                    <h2>¡Gracias por tu compra!</h2>

                    <p>
                        Tu pedido se ha registrado correctamente en URBAN.
                    </p>

                    <div className="pedido-confirmacion-numero">
                        <span>Número de pedido</span>
                        <strong>#{pedidoRegistrado}</strong>
                    </div>

                    <p className="pedido-confirmacion-nota">
                        Conserva este número como referencia de tu pedido.
                    </p>

                    <a href="/productos" className="pedido-confirmacion-boton">
                        VOLVER A LA TIENDA
                    </a>
                </section>
            )}

            {mensaje && (
                <p className="carrito-mensaje-exito" role="status">
                    {mensaje}
                </p>
            )}

            {error && (
                <p className="carrito-mensaje-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}

export default Carrito