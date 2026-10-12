package com.proyectoibero.ecommerce.controller;

import com.proyectoibero.ecommerce.model.Pedido;
import com.proyectoibero.ecommerce.service.PedidoService;
import com.proyectoibero.ecommerce.dto.CrearPedidoDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<Pedido> obtenerTodos() {
        return pedidoService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {

        Optional<Pedido> pedido = pedidoService.obtenerPorId(id);

        if (pedido.isPresent()) {
            return ResponseEntity.ok(pedido.get());
        }

        return ResponseEntity.status(404)
                .body("No se encontró el pedido con ID: " + id);
    }

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(
            @Valid @RequestBody CrearPedidoDTO datos) {

        Pedido pedido = pedidoService.crearPedido(datos);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(pedido);
    }
}