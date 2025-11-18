package tarea4.tarea4.model;
import jakarta.persistence.*;

@Entity
@Table(name = "nota", schema = "tarea2")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "aviso_id", nullable = false)
    private AvisoAdopcion aviso;

    @Column(name = "nota", nullable = false)
    private Integer valor;

    public Integer getId() {
        return id;
    }

    public AvisoAdopcion getAviso() {
        return aviso;
    }

    public void setAviso(AvisoAdopcion aviso) {
        this.aviso = aviso;
    }

    public Integer getValor() {
        return valor;
    }

    public void setValor(Integer valor) {
        this.valor = valor;
    }
}
