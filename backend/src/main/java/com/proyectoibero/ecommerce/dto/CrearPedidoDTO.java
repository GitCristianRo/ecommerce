package com.proyectoibero.ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CrearPedidoDTO {

    @NotBlank(message = "El nombre del cliente es obligatorio.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombreCliente;

    @NotBlank(message = "El correo electrónico es obligatorio.")
    @Email(message = "El formato del correo electrónico no es válido.")
    private String emailCliente;

    @NotBlank(message = "El teléfono del cliente es obligatorio.")
    @Pattern(
            regexp = "^[0-9]{7,15}$",
            message = "El teléfono debe contener entre 7 y 15 dígitos."
    )
    private String telefonoCliente;

    @NotBlank(message = "La dirección de entrega es obligatoria.")
    @Size(max = 200, message = "La dirección no puede superar los 200 caracteres.")
    private String direccion;

    @NotEmpty(message = "El pedido debe contener al menos un producto.")
    @Valid
    private List<ProductoPedidoDTO> productos;

    public CrearPedidoDTO() {
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getEmailCliente() {
        return emailCliente;
    }

    public void setEmailCliente(String emailCliente) {
        this.emailCliente = emailCliente;
    }

    public String getTelefonoCliente() {
        return telefonoCliente;
    }

    public void setTelefonoCliente(String telefonoCliente) {
        this.telefonoCliente = telefonoCliente;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public List<ProductoPedidoDTO> getProductos() {
        return productos;
    }

    public void setProductos(List<ProductoPedidoDTO> productos) {
        this.productos = productos;
    }
}