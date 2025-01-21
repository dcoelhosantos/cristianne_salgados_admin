package com.santacruz.cristiannesalgadosadmin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.MediaType;
import org.springframework.core.io.ByteArrayResource;
import java.util.List;
import java.util.Optional;

import com.santacruz.cristiannesalgadosadmin.services.SalgadoService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.santacruz.cristiannesalgadosadmin.models.Salgado;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080") // Ajuste para o domínio do frontend
public class SalgadoController {

    @Autowired
    private SalgadoService salgadoService;

    @PostMapping("/adicionar-salgado")
    public ResponseEntity<?> cadastrar(
            @RequestParam("nome") String nome,
            @RequestParam("preco") String preco,
            @RequestParam("categoria") String categoria,
            @RequestParam("urlImg") String urlImg,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {

        String apiKey = "key_do_imgbb";
        String url = "https://api.imgbb.com/1/upload?key=" + apiKey;

        try {
            String urlImagem = urlImg;

            // Verifica se a imagem foi fornecida
            if (imagem != null && !imagem.isEmpty()) {
                // Criação do arquivo para enviar para o imgbb
                ByteArrayResource byteArrayResource = new ByteArrayResource(imagem.getBytes()) {
                    @Override
                    public String getFilename() {
                        return imagem.getOriginalFilename();
                    }
                };

                // Envio da imagem para o imgbb via POST
                RestTemplate restTemplate = new RestTemplate();

                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                body.add("image", byteArrayResource);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);

                HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

                // Fazendo o POST para o imgbb
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity,
                        String.class);

                // Extraindo a URL da resposta
                String responseBody = response.getBody();
                urlImagem = extractImageUrlFromResponse(responseBody);
            }

            // Verifica se o salgado já existe
            if (salgadoService.buscarPorNome(nome).isEmpty()) {
                // Criar o objeto Salgado
                Salgado salgado = new Salgado();
                salgado.setNome(nome);
                salgado.setPreco(preco);
                salgado.setClasse(categoria);
                salgado.setUrlFoto(urlImagem); // Definindo a URL da imagem

                // Salvar o salgado
                salgadoService.salvarSalgado(salgado);

                return ResponseEntity.ok().body("{\"success\": true}");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Salgado já existe!\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Não foi possível adicionar o salgado!\"}");
        }
    }

    // Método para extrair a URL da imagem da resposta do imgbb
    private String extractImageUrlFromResponse(String responseBody) {
        // Aqui você pode utilizar um parser JSON, como Jackson ou Gson, para extrair a
        // URL da resposta
        // Exemplo com Jackson:
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            return rootNode.path("data").path("url").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Método para remover salgado
    @DeleteMapping("/remover-salgado")
    public ResponseEntity<?> remover(@RequestParam("nome") String nome) {
        try {
            // Buscar o produto pelo nome
            Optional<Salgado> salgado = salgadoService.buscarPorNome(nome);

            if (salgado.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Produto não encontrado!\"}");
            }

            // Remover o produto
            salgadoService.removerSalgado(salgado.get());

            return ResponseEntity.ok().body("{\"success\": true}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Não foi possível remover o produto!\"}");
        }
    }

    // Método para listar todos os salgados
    @GetMapping("/salgados")
    public ResponseEntity<List<Salgado>> listarSalgados() {
        try {
            List<Salgado> salgados = salgadoService.listarSalgados();
            return ResponseEntity.ok(salgados);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}