package com.proyectoibero.ecommerce.service;

import com.proyectoibero.ecommerce.dto.CrearPedidoDTO;
import com.proyectoibero.ecommerce.dto.ProductoPedidoDTO;
import com.proyectoibero.ecommerce.model.DetallePedido;
import com.proyectoibero.ecommerce.model.Pedido;
import com.proyectoibero.ecommerce.model.Producto;
import com.proyectoibero.ecommerce.repository.PedidoRepository;
import com.proyectoibero.ecommerce.repository.ProductoRepository;
import com.proyectoibero.ecommerce.repository.DetallePedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final DetallePedidoRepository detallePedidoRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ProductoRepository productoRepository,
            DetallePedidoRepository detallePedidoRepository) {

        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
    }

    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> obtenerPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    public Pedido guardar(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido crearPedido(CrearPedidoDTO datos) {

        if (datos == null
                || datos.getProductos() == null
                || datos.getProductos().isEmpty()) {
            throw new IllegalArgumentException(
                    "El pedido debe contener al menos un producto.");
        }

        Pedido pedido = new Pedido();

        pedido.setNombreCliente(datos.getNombreCliente());
        pedido.setEmailCliente(datos.getEmailCliente());
        pedido.setTelefonoCliente(datos.getTelefonoCliente());
        pedido.setDireccion(datos.getDireccion());
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("PENDIENTE");

        double total = 0.0;

        List<DetallePedido> detalles = new ArrayList<>();
        Map<Long, Integer> cantidadesPorProducto = new HashMap<>();
        Map<Long, Producto> productosPorId = new HashMap<>();

        // Primera etapa: validar y acumular las cantidades solicitadas.
        for (ProductoPedidoDTO productoDTO : datos.getProductos()) {

            if (productoDTO == null
                    || productoDTO.getProductoId() == null) {
                throw new IllegalArgumentException(
                        "Cada producto debe tener un identificador válido.");
            }

            if (productoDTO.getCantidad() == null
                    || productoDTO.getCantidad() <= 0) {
                throw new IllegalArgumentException(
                        "La cantidad debe ser mayor que cero.");
            }

            Long productoId = productoDTO.getProductoId();

            Producto producto = productoRepository.findById(productoId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "No existe el producto con ID: " + productoId));

            if (producto.getStock() == null || producto.getStock() < 0) {
                throw new IllegalArgumentException(
                        "El stock del producto no es válido: "
                                + producto.getNombre());
            }

            if (producto.getPrecio() == null
                    || producto.getPrecio() <= 0) {
                throw new IllegalArgumentException(
                        "El producto tiene un precio inválido: "
                                + producto.getNombre());
            }

            cantidadesPorProducto.merge(
                    productoId, productoDTO.getCantidad(), Integer::sum);

            productosPorId.put(productoId, producto);

            double subtotal = producto.getPrecio() * productoDTO.getCantidad();

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(productoDTO.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(subtotal);

            detalles.add(detalle);
            total += subtotal;
        }

        // Segunda etapa: comprobar el stock total de cada producto.
        for (Map.Entry<Long, Integer> entrada
                : cantidadesPorProducto.entrySet()) {

            Producto producto = productosPorId.get(entrada.getKey());
            int cantidadSolicitada = entrada.getValue();

            if (producto.getStock() < cantidadSolicitada) {
                throw new IllegalArgumentException(
                        "Stock insuficiente para el producto: "
                                + producto.getNombre());
            }
        }

        // Tercera etapa: descontar el inventario.
        for (Map.Entry<Long, Integer> entrada
                : cantidadesPorProducto.entrySet()) {

            Producto producto = productosPorId.get(entrada.getKey());

            producto.setStock(producto.getStock() - entrada.getValue());

            productoRepository.save(producto);
        }

        // Cuarta etapa: guardar el pedido y sus detalles.
        pedido.setTotal(total);
        pedido = pedidoRepository.save(pedido);

        for (DetallePedido detalle : detalles) {
            detalle.setPedido(pedido);
            detallePedidoRepository.save(detalle);
        }

        return pedido;
    }
}