package com.proyectoibero.ecommerce.repository;

import com.proyectoibero.ecommerce.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}