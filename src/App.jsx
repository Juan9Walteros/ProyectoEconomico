import React, { useState } from 'react';
import Header from './assets/components/Header';

function App() {
  // Estados para almacenar los valores del formulario y el resultado
  const [formData, setFormData] = useState({
    empresa: '',
    ganancias: '',
    sector: '',
    empleados: '',
    activos: '',
    cartera: '',
    deudas: '',
  });

  const [resultado, setResultado] = useState(''); // Estado para el resultado

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Permitir solo números y puntos en los campos numéricos
    if (['ganancias', 'activos', 'cartera', 'deudas'].includes(name)) {
      const numericValue = value.replace(/[^0-9.]/g, ''); // Elimina caracteres no numéricos
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);

    // Realizar la evaluación económica
    const resultadoEvaluacion = evaluarEconomia(formData);
    setResultado(resultadoEvaluacion); // Actualizar el estado del resultado
  };

  // Función para evaluar la economía de la empresa
  const evaluarEconomia = (data) => {
    const { ganancias, activos, cartera, deudas } = data;
    const balance = parseFloat(ganancias) + parseFloat(activos) + parseFloat(cartera) - parseFloat(deudas);

    if (balance > 0) {
      return 'La empresa está en buen estado económico.';
    } else {
      return 'La empresa tiene problemas económicos.';
    }
  };

  return (
    <div>
      <Header />

      {/* Contenedor principal */}
      <div className="main-container">
        {/* Contenedor izquierdo */}
        <main className="txt1 text-center justify-content-center">
          <div className="form-container">
            <h1>Evaluación Económica</h1>
            <p>Ingresa los datos de tu empresa para evaluar su estado económico.</p>
            <form onSubmit={handleSubmit}>
              {/* Campos del formulario */}
              <label htmlFor="empresa">Nombre de la empresa:</label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                placeholder="Ingresa el nombre"
                value={formData.empresa}
                onChange={handleChange}
                required
              />

              <label htmlFor="ganancias">Valor anual ganancias (Pesos):</label>
              <div className="input-group">
                <span className="input-prefix">$</span>
                <input
                  type="text"
                  id="ganancias"
                  name="ganancias"
                  placeholder="Ingresa el valor"
                  value={formData.ganancias}
                  onChange={handleChange}
                  required
                />
              </div>

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
              <div className="input-group">
                <span className="input-prefix">$</span>
                <input
                  type="text"
                  id="activos"
                  name="activos"
                  placeholder="Ingresa el valor"
                  value={formData.activos}
                  onChange={handleChange}
                  required
                />
              </div>

              <label htmlFor="cartera">Valor en cartera (Pesos):</label>
              <div className="input-group">
                <span className="input-prefix">$</span>
                <input
                  type="text"
                  id="cartera"
                  name="cartera"
                  placeholder="Ingresa el valor"
                  value={formData.cartera}
                  onChange={handleChange}
                  required
                />
              </div>

              <label htmlFor="deudas">Valor de deudas (Pesos):</label>
              <div className="input-group">
                <span className="input-prefix">$</span>
                <input
                  type="text"
                  id="deudas"
                  name="deudas"
                  placeholder="Ingresa el valor"
                  value={formData.deudas}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit">Evaluar</button>
            </form>
          </div>
        </main>

        {/* Contenedor derecho */}
        <aside className="info-container">
          <h2>Resultados</h2>
          <p>{resultado}</p> {/* Mostrar el resultado dinámicamente */}
        </aside>
      </div>
    </div>
  );
}

export default App;