package tarea4.tarea4.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tarea4.tarea4.model.AvisoAdopcion;

public interface AvisoRepository extends JpaRepository<AvisoAdopcion, Integer> {
}
