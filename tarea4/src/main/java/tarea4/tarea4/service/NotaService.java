package tarea4.tarea4.service;
import org.springframework.stereotype.Service;
import java.util.List;
import tarea4.tarea4.model.Nota;
import tarea4.tarea4.model.AvisoAdopcion;
import tarea4.tarea4.repository.NotaRepository;

@Service
public class NotaService {
    private final NotaRepository repo;
    public NotaService(NotaRepository repo) {
        this.repo = repo;
    }

    public double obtenerPromedio(AvisoAdopcion aviso) {
        List<Nota> notas = aviso.getNotas();
        // validar entero entre 1 y 7
        if (valor == null || valor < 1 || valor > 7) {
            throw new IllegalArgumentException("La nota debe ser un número entero entre 1 y 7.");
        }

        return notas.stream()
                .mapToInt(Nota::getValor)
                .average()
                .orElse(-1);
    }

    public Nota agregarNota(AvisoAdopcion aviso, int valor) {
        Nota n = new Nota();
        n.setAviso(aviso);   
        n.setValor(valor);
        return repo.save(n);
    }
}
