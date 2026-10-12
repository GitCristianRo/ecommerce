package com.proyectoibero.ecommerce.dto;

public class ProductoPedidoDTO {

    private Long productoId;

    private Integer cantidad;

    public ProductoPedidoDTO() {
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

}

