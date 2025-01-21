package com.santacruz.cristiannesalgadosadmin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.santacruz.cristiannesalgadosadmin.models.Salgado;

import java.util.Optional;

public interface SalgadoRepository extends JpaRepository<Salgado, Long> {

    // Método para buscar um salgado pelo nome
    Optional<Salgado> findByNome(String nome);
}