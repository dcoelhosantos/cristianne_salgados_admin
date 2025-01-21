package com.santacruz.cristiannesalgadosadmin.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.santacruz.cristiannesalgadosadmin.models.Pedido;

import jakarta.transaction.Transactional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Método para buscar um salgado pelo nome
    List<Pedido> findByStatus(String status);

    // Método para atualizar os status de um pedido
    @Modifying
    @Transactional
    @Query("UPDATE Pedido p SET p.status = :status WHERE p.id = :id")
    int updateStatus(Long id, String status);

    // Método para filtrar por data os pedidos aceitos
    @Query("SELECT p FROM Pedido p WHERE p.status = :status AND DATE(p.dataRetirada) = :data")
    List<Pedido> findByStatusAndData(@Param("status") String status, @Param("data") LocalDate data);
}