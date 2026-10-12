import { useEffect, useState } from 'react'
import axios from 'axios'

function AdminPedidos() {
    const [pedidos, setPedidos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/pedidos')
            .then((response) => {
                setPedidos(response.data)
            })
            .catch((error) => {
                console.error('Error al obtener los pedidos:', error)
                setError(true)
            })
            .finally(() => {
                setCargando(false)
            })
    }, [])

    const formatoMoneda = (valor) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(valor)
    }

    const formatoFecha = (fecha) => {
        if (!fecha) return 'Sin fecha'

        const fechaValida = new Date(fecha)

        if (Number.isNaN(fechaValida.getTime())) {
            return 'Fecha no disponible'
        }

        return fechaValida.toLocaleString('es-CO', {
            dateStyle: 'short',
            timeStyle: 'short',
        })
    }

    const pedidosPendientes = pedidos.filter(
        (pedido) => pedido.estado === 'PENDIENTE'
    ).length

    const totalVentas = pedidos.reduce(
        (total, pedido) => total + Number(pedido.total || 0),
        0
    )

    return (
        <main className="admin-pedidos">
            <header className="admin-header">
                <div>
                    <span className="admin-etiqueta">
                        URBAN / ADMINISTRACIÓN
                    </span>

                    <h1>Gestión de pedidos</h1>

                    <p>
                        Consulta los pedidos realizados en tu tienda.
                    </p>
                </div>

                <button
                    className="admin-recargar"
                    onClick={() => window.location.reload()}
                >
                    Actualizar pedidos
                </button>
            </header>

            {cargando ? (
                <p className="admin-mensaje">
                    Cargando pedidos...
                </p>
            ) : error ? (
                <p className="admin-mensaje admin-error">
                    No fue posible cargar los pedidos.
                    Comprueba que el backend esté funcionando.
                </p>
            ) : (
                <>
                    <section className="admin-resumen">
                        <article className="admin-resumen-card">
                            <span>Total de pedidos</span>
                            <strong>{pedidos.length}</strong>
                        </article>

                        <article className="admin-resumen-card">
                            <span>Pedidos pendientes</span>
                            <strong>{pedidosPendientes}</strong>
                        </article>

                        <article className="admin-resumen-card">
                            <span>Valor acumulado</span>
                            <strong>{formatoMoneda(totalVentas)}</strong>
                        </article>
                    </section>

                    <section className="admin-tabla-contenedor">
                        <div className="admin-tabla-header">
                            <div>
                                <h2>Pedidos registrados</h2>
                                <p>
                                    Historial de compras realizadas en URBAN.
                                </p>
                            </div>
                        </div>

                        {pedidos.length === 0 ? (
                            <p className="admin-mensaje">
                                Todavía no hay pedidos registrados.
                            </p>
                        ) : (
                            <div className="admin-tabla-scroll">
                                <table className="admin-tabla">
                                    <thead>
                                        <tr>
                                            <th>Pedido</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {pedidos.map((pedido) => (
                                            <tr key={pedido.id}>
                                                <td>
                                                    <strong>
                                                        #{pedido.id}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <div className="admin-cliente">
                                                        <strong>
                                                            {pedido.nombreCliente}
                                                        </strong>

                                                        <span>
                                                            {pedido.emailCliente}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    {formatoFecha(pedido.fecha)}
                                                </td>

                                                <td className="admin-total">
                                                    {formatoMoneda(pedido.total)}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`admin-estado ${
                                                            pedido.estado === 'PENDIENTE'
                                                                ? 'admin-estado-pendiente'
                                                                : 'admin-estado-otro'
                                                        }`}
                                                    >
                                                        {pedido.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    )
}

export default AdminPedidos
