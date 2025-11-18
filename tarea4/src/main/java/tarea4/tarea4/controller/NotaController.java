package tarea4.tarea4.controller;
import org.springframework.web.bind.annotation.*;
import tarea4.tarea4.repository.AvisoRepository;
import tarea4.tarea4.service.NotaService;
import tarea4.tarea4.model.AvisoAdopcion;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    private final NotaService service;
    private final AvisoRepository avisoRepo;

    public NotaController(NotaService service, AvisoRepository avisoRepo) {
        this.service = service;
        this.avisoRepo = avisoRepo;
    }

    // Obtener promedio de un aviso
    @GetMapping("/{avisoId}/promedio")
    public Map<String, Object> getPromedio(@PathVariable Integer avisoId) {

        AvisoAdopcion aviso = avisoRepo.findById(avisoId)
                .orElseThrow(() -> new RuntimeException("Aviso no encontrado"));

        double promedio = service.obtenerPromedio(aviso);

        Map<String, Object> resp = new HashMap<>();
        resp.put("promedio", promedio);
        return resp;
    }

    // Agregar una nota
    @PostMapping("/{avisoId}/agregar")
    public Map<String, Object> agregarNota(
            @PathVariable Integer avisoId,
            @RequestBody Map<String, Integer> body
    ) {
        Map<String, Object> resp = new HashMap<>();

            try {
                Integer nota = body.get("nota");
                double promedio = service.agregarNota(id, nota);

                resp.put("ok", true);
                resp.put("promedio", promedio);

            } catch (IllegalArgumentException e) {
                resp.put("ok", false);
                resp.put("error", e.getMessage());
            }

            return resp;
        }