package tarea4.tarea4.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tarea4.tarea4.model.Nota;
import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Integer> {
    List<Nota> findByAvisoId(Integer avisoId);
}
