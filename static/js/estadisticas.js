// ===== GRÁFICO 1: AVISOS POR DÍA (LÍNEAS)  =====
function cargarGraficoLineas() {
    const canvas = document.getElementById('graficoLineas');
    const loading = document.getElementById('loadingLineas');
    
    fetch('/api/estadisticas/avisos-por-dia')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar datos');
            return response.json();
        })
        .then(data => {
            loading.style.display = 'none';
            
            if (data.fechas.length === 0) {
                loading.textContent = 'No hay datos disponibles';
                loading.style.display = 'block';
                return;
            }
            
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: data.fechas,
                    datasets: [{
                        label: 'Cantidad de avisos',
                        data: data.cantidades,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#4CAF50',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            },
                            title: {
                                display: true,
                                text: 'Cantidad de avisos'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Fecha'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            loading.textContent = 'Error al cargar los datos';
            loading.className = 'error';
        });
}

// ===== GRÁFICO 2: AVISOS POR TIPO (TORTA) =====
function cargarGraficoTorta() {
    const canvas = document.getElementById('graficoTorta');
    const loading = document.getElementById('loadingTorta');
    
    fetch('/api/estadisticas/avisos-por-tipo')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar datos');
            return response.json();
        })
        .then(data => {
            loading.style.display = 'none';
            
            if (data.tipos.length === 0) {
                loading.textContent = 'No hay datos disponibles';
                loading.style.display = 'block';
                return;
            }
            
            new Chart(canvas, {
                type: 'pie',
                data: {
                    labels: data.tipos,
                    datasets: [{
                        label: 'Cantidad de avisos',
                        data: data.cantidades,
                        backgroundColor: [
                            'rgba(255, 152, 0, 0.8)',  // Naranja para gatos
                            'rgba(33, 150, 243, 0.8)'   // Azul para perros
                        ],
                        borderColor: [
                            'rgba(255, 152, 0, 1)',
                            'rgba(33, 150, 243, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            loading.textContent = 'Error al cargar los datos';
            loading.className = 'error';
        });
}

// ===== GRÁFICO 3: AVISOS POR MES (BARRAS) =====
function cargarGraficoBarras() {
    const canvas = document.getElementById('graficoBarras');
    const loading = document.getElementById('loadingBarras');
    
    fetch('/api/estadisticas/avisos-por-mes')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar datos');
            return response.json();
        })
        .then(data => {
            loading.style.display = 'none';
            
            if (data.meses.length === 0) {
                loading.textContent = 'No hay datos disponibles';
                loading.style.display = 'block';
                return;
            }
            
            // Convertir formato YYYY-MM a nombre de mes
            const mesesNombres = data.meses.map(mes => {
                const [anio, mesNum] = mes.split('-');
                const fecha = new Date(anio, parseInt(mesNum) - 1);
                const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
            });
            
            new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: mesesNombres,
                    datasets: [
                        {
                            label: 'Gatos',
                            data: data.gatos,
                            backgroundColor: 'rgba(255, 152, 0, 0.8)',
                            borderColor: 'rgba(255, 152, 0, 1)',
                            borderWidth: 2
                        },
                        {
                            label: 'Perros',
                            data: data.perros,
                            backgroundColor: 'rgba(33, 150, 243, 0.8)',
                            borderColor: 'rgba(33, 150, 243, 1)',
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            },
                            title: {
                                display: true,
                                text: 'Cantidad de avisos'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Mes'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            loading.textContent = 'Error al cargar los datos';
            loading.className = 'error';
        });
}

// ===== CARGAR TODOS LOS GRÁFICOS AL INICIAR =====
document.addEventListener('DOMContentLoaded', function() {
    cargarGraficoLineas();
    cargarGraficoTorta();
    cargarGraficoBarras();
});