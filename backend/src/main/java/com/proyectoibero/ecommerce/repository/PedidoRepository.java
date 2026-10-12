package com.proyectoibero.ecommerce.repository;

import com.proyectoibero.ecommerce.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}