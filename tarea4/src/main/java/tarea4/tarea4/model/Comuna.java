package tarea4.tarea4.model;
import jakarta.persistence.*;

@Entity
@Table(name = "comuna", schema = "tarea2")
public class Comuna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(name = "region_id")
    private Integer regionId;

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Integer getRegionId() {
        return regionId;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setRegionId(Integer regionId) {
        this.regionId = regionId;
    }
}
