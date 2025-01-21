package com.santacruz.cristiannesalgadosadmin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

import com.santacruz.cristiannesalgadosadmin.services.PedidoService;
import com.santacruz.cristiannesalgadosadmin.models.Pedido;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080") // Ajuste para o domínio do frontend
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // Método para listar todos os pedidos aceitos
    @GetMapping("/pedidos-aceitos")
    public ResponseEntity<List<Pedido>> listarPedidosAceitos() {
        try {
            List<Pedido> pedidos = pedidoService.listarPedidosAceitos();
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Método para listar todos os pedidos novos
    @GetMapping("/novos-pedidos")
    public ResponseEntity<List<Pedido>> listarNovosPedidos() {
        try {
            List<Pedido> pedidos = pedidoService.listarNovosPedidos();
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //Método para filtrar os pedidos aceitos por data
    @GetMapping("/pedidos-por-data")
    public ResponseEntity<List<Pedido>> getPedidosAceitosPorData(@RequestParam String data) {
        try {
            LocalDate dataFiltro = LocalDate.parse(data); // Converte a data do parâmetro
            System.out.println(data);
            List<Pedido> pedidos = pedidoService.getPedidosAceitosPorData(dataFiltro);
            return ResponseEntity.ok(pedidos);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build(); // Retorna erro se o formato da data for inválido
        }
    }

    //Método para buscar pedido pelo seu id
    @GetMapping("/pedidos/{id}")
    public ResponseEntity<Pedido> buscarPedidoPorId(@PathVariable Long id) {
        System.out.println("chegou");
        try {
            return pedidoService.buscarPedidoPorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //Método para atualizar os status de um pedido
    @PostMapping("/atualizar-status")
    public ResponseEntity<?> atualizarStatus(
            @RequestParam("id") long id,
            @RequestParam("status") String status) {

        try {
            // Buscar o produto pelo nome
            Optional<Pedido> pedido = pedidoService.buscarPedidoPorId(id);

            if (pedido.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Pedido não encontrado!\"}");
            }

            // Atualizando o status do pedido
            pedidoService.atualizarStatus(pedido.get(), status);

            return ResponseEntity.ok().body("{\"success\": true}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Não foi possível adicionar o salgado!\"}");
        }
    }
}