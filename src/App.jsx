import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import Header from "./assets/components/Header";
import Gauge from "react-gauge-component";
import ChatBot from "./assets/components/ChatBot"; // Asegúrate de que la ruta sea correcta

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function App() {
  const [formData, setFormData] = useState({
    nombre: "",
    ganancias: "",
    sector: "",
    empleados: "",
    activos: "",
    cartera: "",
    deudas: "",
  });

  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Permitir solo números en los campos numéricos
    if (["ganancias", "activos", "cartera", "deudas"].includes(name)) {
      const numericValue = value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
      setFormData({ ...formData, [name]: numericValue }); // Guardar el valor sin formatear
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/process/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          ganancias: parseFloat(
            formData.ganancias.replace(/\./g, "").replace(/,/g, "")
          ),
          sector: formData.sector,
          empleados: parseInt(formData.empleados),
          activos: parseFloat(
            formData.activos.replace(/\./g, "").replace(/,/g, "")
          ),
          cartera: parseFloat(
            formData.cartera.replace(/\./g, "").replace(/,/g, "")
          ),
          deudas: parseFloat(
            formData.deudas.replace(/\./g, "").replace(/,/g, "")
          ),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al comunicarse con el backend");
      }

      const data = await response.json();
      setResultado(data);
    } catch (error) {
      console.error("Error:", error);
      setResultado({ error: "Error al procesar los datos." });
    }
  };

  // Datos para el gráfico de pastel
  const pieData = resultado
    ? {
        labels: ["Activos", "Cartera", "Deudas"],
        datasets: [
          {
            label: "Distribución económica",
            data: [
              resultado.analisis_economico.activos,
              resultado.analisis_economico.cartera,
              resultado.analisis_economico.deudas,
            ],
            backgroundColor: ["#67AE6E", "#90C67C", "#FF6B6B"],
            borderColor: ["#328E6E", "#67AE6E", "#FF4C4C"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Datos para el gráfico de barras
  const barData = resultado
    ? {
        labels: ["Patrimonio"],
        datasets: [
          {
            label: "Estado económico",
            data: [resultado.analisis_economico.patrimonio],
            backgroundColor:
              resultado.analisis_economico.estado === "saludable"
                ? "#67AE6E"
                : "#FF6B6B",
            borderColor:
              resultado.analisis_economico.estado === "saludable"
                ? "#328E6E"
                : "#FF4C4C",
            borderWidth: 1,
          },
        ],
      }
    : null;

  return (
    <div>
      <Header /> {/* Componente del encabezado */}
      <div className="main-container">
        {/* Contenedor izquierdo: Formulario */}
        <main className="form-container">
          <h2>Ingresa los datos de tu empresa</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre de la empresa:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingresa el nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <label htmlFor="ganancias">Valor anual ganancias (Pesos):</label>
            <input
              type="text"
              id="ganancias"
              name="ganancias"
              placeholder="Ingresa el valor"
              value={
                formData.ganancias
                  ? new Intl.NumberFormat("es-ES").format(formData.ganancias)
                  : ""
              }
              onChange={handleChange}
              required
            />

            <label htmlFor="sector">Sector:</label>
            <select
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona el sector</option>
              <option value="tecnologia">Tecnología</option>
              <option value="salud">Salud</option>
              <option value="educacion">Educación</option>
              <option value="comercio">Comercio</option>
              <option value="otros">Otros</option>
            </select>

            <label htmlFor="empleados">Número de empleados:</label>
            <input
              type="number"
              id="empleados"
              name="empleados"
              placeholder="Ingresa el número"
              value={formData.empleados}
              onChange={handleChange}
              required
            />

            <label htmlFor="activos">Valor en activos (Pesos):</label>
            <input
              type="text"
              id="activos"
              name="activos"
              placeholder="Ingresa el valor"
              value={
                formData.activos
                  ? new Intl.NumberFormat("es-ES").format(formData.activos)
                  : ""
              }
              onChange={handleChange}
              required
            />

            <label htmlFor="cartera">Valor en cartera (Pesos):</label>
            <input
              type="text"
              id="cartera"
              name="cartera"
              placeholder="Ingresa el valor"
              value={
                formData.cartera
                  ? new Intl.NumberFormat("es-ES").format(formData.cartera)
                  : ""
              }
              onChange={handleChange}
              required
            />

            <label htmlFor="deudas">Valor de deudas (Pesos):</label>
            <input
              type="text"
              id="deudas"
              name="deudas"
              placeholder="Ingresa el valor"
              value={
                formData.deudas
                  ? new Intl.NumberFormat("es-ES").format(formData.deudas)
                  : ""
              }
              onChange={handleChange}
              required
            />

            <button type="submit">Evaluar</button>
          </form>
        </main>

        {/* Contenedor derecho: Resultados */}
        {/* Contenedor derecho: Resultados */}
        <aside className="info-container">
          <h2>Resultados</h2>
          {resultado && !resultado.error ? (
            <div>
              <p>
                <strong>Empresa:</strong> {resultado.empresa}
              </p>
              <p>
                <strong>Sector:</strong> {resultado.sector}
              </p>
              <p>
                <strong>Estado económico:</strong>{" "}
                {resultado.analisis_economico.estado}
              </p>
              <p>
                <strong>Patrimonio:</strong> $
                {new Intl.NumberFormat("es-ES").format(
                  resultado.analisis_economico.patrimonio
                )}
              </p>

              {/* Otras gráficas */}
              <h3>Gráficas</h3>
              <div className="graph-container">
                {/* Gráfico de pastel */}
                {pieData && (
                  <div className="graph">
                    <Pie data={pieData} />
                  </div>
                )}
                /* Gráfico de barras */
                {/* Gráfico de barras */}
                {barData && (
                  <div className="graph">
                    <Bar data={barData} />
                  </div>
                )}
              </div>
              {/* Gráfica Gauge */}
              <div className="gauge-container">
                <h3>Estado Económico General</h3>
                <Gauge
                  value={
                    resultado?.analisis_economico.estado === "saludable"
                      ? 75
                      : resultado?.analisis_economico.estado === "en riesgo"
                      ? 50
                      : 25
                  }
                  minValue={0}
                  maxValue={100}
                  segments={3}
                  colors={["#FF6B6B", "#FFD700", "#67AE6E"]}
                  needleColor="#213547"
                  labelFormat={(value) =>
                    resultado?.analisis_economico.estado === "saludable"
                      ? "Saludable"
                      : resultado?.analisis_economico.estado === "en riesgo"
                      ? "En Riesgo"
                      : "Crítico"
                  }
                  labelStyle={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    fill: "#213547",
                  }}
                  width="100%" // 🔄 Cambiado
                  height={200} // Puedes dejar un valor más pequeño aquí
                />

                {/* Etiquetas de los estados */}
                <div className="gauge-labels">
                  <span style={{ color: "#FF6B6B" }}>Crítico</span>
                  <span></span>
                  <span style={{ color: "#FFD700" }}>En Riesgo</span>
                  <span></span>
                  <span style={{ color: "#67AE6E" }}>Saludable</span>
                </div>
              </div>
            </div>
          ) : (
            <p>{resultado?.error || "Ingresa los datos para evaluar."}</p>
          )}
          <ChatBot />
        </aside>
      </div>
      <ChatBot />
    </div>
  );
}

export default App;
