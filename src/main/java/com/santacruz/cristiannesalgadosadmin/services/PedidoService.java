package com.santacruz.cristiannesalgadosadmin.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.santacruz.cristiannesalgadosadmin.models.Pedido;
import com.santacruz.cristiannesalgadosadmin.repositories.PedidoRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    // Listar todos os pedidos
    public List<Pedido> listarPedidosAceitos() {
        return pedidoRepository.findByStatus("Aceito");
    }

    // Listar todos os novos pedidos
    public List<Pedido> listarNovosPedidos() {
        return pedidoRepository.findByStatus("Em análise");
    }

    //Filtrar pedidos aceitos por data
    public List<Pedido> getPedidosAceitosPorData(LocalDate data) {
        return pedidoRepository.findByStatusAndData("Aceito", data);
    }

    // Buscar pedido por id
    public Optional<Pedido> buscarPedidoPorId(long id) {
        return pedidoRepository.findById(id);
    }

    // Atualizar status do pedido
    public void atualizarStatus(Pedido pedido, String status){
        pedidoRepository.updateStatus(pedido.getId(), status);
    }
}
