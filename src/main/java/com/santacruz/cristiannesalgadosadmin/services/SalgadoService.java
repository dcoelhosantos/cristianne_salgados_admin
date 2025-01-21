package com.santacruz.cristiannesalgadosadmin.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.santacruz.cristiannesalgadosadmin.models.Salgado;
import com.santacruz.cristiannesalgadosadmin.repositories.SalgadoRepository;

@Service
public class SalgadoService {

    @Autowired
    private SalgadoRepository salgadoRepository;

    // Salvar salgado
    public void salvarSalgado(Salgado salgado) {
        salgadoRepository.save(salgado);
    }

    //Remover salgado
    public void removerSalgado(Salgado salgado){
        salgadoRepository.delete(salgado);
    }

    // Listar todos os salgados
    public List<Salgado> listarSalgados() {
        return salgadoRepository.findAll();
    }

    // Buscar salgado por nome
    public Optional<Salgado> buscarPorNome(String nome) {
        return salgadoRepository.findByNome(nome);
    }
}
