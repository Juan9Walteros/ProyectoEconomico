import React, { useState } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! ¿En qué te puedo ayudar?" },
  ]);
  const [input, setInput] = useState("");
  const [collectingData, setCollectingData] = useState(false);
  const [empresaData, setEmpresaData] = useState({
    nombre: "",
    ganancias: 0,
    sector: "",
    empleados: 0,
    activos: 0,
    cartera: 0,
    deudas: 0,
  });
  const [currentField, setCurrentField] = useState("");

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    if (collectingData) {
      // Actualizar el campo actual con el valor ingresado
      setEmpresaData((prevData) => ({
        ...prevData,
        [currentField]: isNaN(input) ? input : parseFloat(input),
      }));

      // Determinar el siguiente campo a solicitar
      const fields = [
        "nombre",
        "ganancias",
        "sector",
        "empleados",
        "activos",
        "cartera",
        "deudas",
      ];
      const nextFieldIndex = fields.indexOf(currentField) + 1;

      if (nextFieldIndex < fields.length) {
        setCurrentField(fields[nextFieldIndex]);
        newMessages.push({
          sender: "bot",
          text: `Por favor, ingresa el valor para ${fields[nextFieldIndex]}:`,
        });
      } else {
        // Enviar los datos al backend
        try {
          const response = await fetch("http://localhost:8000/process/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(empresaData),
          });

          if (response.ok) {
            const result = await response.json();
            newMessages.push({
              sender: "bot",
              text: `Análisis económico: El patrimonio es ${result.analisis_economico.patrimonio} y el estado es ${result.analisis_economico.estado}. Si de seas ver las graficas por favor ingresa los datos en el formulario.`,
            });
          } else {
            newMessages.push({
              sender: "bot",
              text: "Hubo un error al procesar los datos. Por favor, intenta nuevamente.",
            });
          }
        } catch (error) {
          newMessages.push({
            sender: "bot",
            text: "No se pudo conectar con el servidor. Verifica tu conexión.",
          });
        }

        // Finalizar la recopilación de datos
        setCollectingData(false);
        setCurrentField("");
        setEmpresaData({
          nombre: "",
          ganancias: 0,
          sector: "",
          empleados: 0,
          activos: 0,
          cartera: 0,
          deudas: 0,
        });
      }
    } else if (input.toLowerCase().includes("ingresar datos")) {
      setCollectingData(true);
      setCurrentField("nombre");
      newMessages.push({
        sender: "bot",
        text: "Vamos a ingresar los datos de la empresa. Por favor, ingresa el nombre de la empresa:",
      });
    } else {
      const respuesta = generarRespuesta(input);
      if (respuesta) {
        newMessages.push({ sender: "bot", text: respuesta });
      }
    }

    setMessages(newMessages);
    setInput("");
  };

  const generarRespuesta = (msg) => {
    const lower = msg.toLowerCase();

    if (lower.includes("cartera"))
      return "La cartera se refiere a las cuentas por cobrar de una empresa.";
    if (lower.includes("liquidez"))
      return "La liquidez es la capacidad de una empresa para pagar sus deudas a corto plazo.";
    if (lower.includes("solvencia"))
      return "La solvencia es la capacidad de una empresa para cumplir sus obligaciones financieras a largo plazo.";
    if (lower.includes("formulario"))
      return "Para llenar el formulario, completa todos los campos marcados como obligatorios.";
    if (
      input.includes("qué es cartera") ||
      input.includes("valor en cartera")
    ) {
      return "La cartera se refiere a las cuentas por cobrar de una empresa, es decir, el dinero que aún no ha sido recibido por ventas a crédito.";
    }
    if (
      input.includes("qué son activos") ||
      input.includes("valor en activos")
    ) {
      return "Los activos representan todo lo que posee la empresa que tiene valor económico, como maquinaria, edificios o dinero.";
    }
    if (input.includes("qué son deudas") || input.includes("valor deudas")) {
      return "Las deudas son obligaciones financieras que la empresa debe pagar, como préstamos o créditos adquiridos.";
    }
    if (
      input.includes("qué es una proyección financiera") ||
      input.includes("proyección ganancias")
    ) {
      return "Una proyección financiera es una estimación de los ingresos y egresos futuros de una empresa, útil para planear el crecimiento.";
    }

    if (
      input.includes("cómo reducir deudas") ||
      input.includes("reducir pasivos")
    ) {
      return "Reducir deudas implica controlar gastos, renegociar préstamos y aumentar ingresos o capital.";
    }

    if (input.includes("qué es el capital de trabajo")) {
      return "Es la diferencia entre los activos corrientes y los pasivos corrientes. Es clave para la operación diaria de la empresa.";
    }

    if (
      input.includes("para qué sirve el balance general") ||
      input.includes("qué es balance general")
    ) {
      return "El balance general muestra la situación financiera de una empresa: lo que posee (activos), lo que debe (pasivos) y su patrimonio.";
    }

    if (
      input.includes("cuándo una empresa es rentable") ||
      input.includes("empresa rentable")
    ) {
      return "Una empresa es rentable cuando sus ingresos superan sus costos y gastos de forma sostenida en el tiempo.";
    }

    if (
      input.includes("qué es liquidez") ||
      input.includes("empresa líquida")
    ) {
      return "La liquidez es la capacidad de la empresa para cumplir sus obligaciones a corto plazo usando sus activos disponibles.";
    }

    if (input.includes("diferencia entre utilidad y ganancia")) {
      return "Aunque a veces se usan como sinónimos, la utilidad puede referirse a diferentes tipos (bruta, neta), mientras que ganancia suele referirse a la utilidad neta.";
    }

    if (
      input.includes("qué es una pérdida") ||
      input.includes("empresa en pérdida")
    ) {
      return "Una pérdida ocurre cuando los gastos superan los ingresos, afectando la salud financiera de la empresa.";
    }

    if (
      input.includes("qué es el sector") ||
      input.includes("sectores económicos")
    ) {
      return "El sector al que pertenece una empresa define su actividad económica, como el sector salud, educativo, industrial o tecnológico.";
    }

    if (
      input.includes("ganancias anuales") ||
      input.includes("valor anual ganancias")
    ) {
      return "Las ganancias anuales son los beneficios netos obtenidos por una empresa en un año después de restar costos y gastos.";
    }

    if (input.includes("empleados") || input.includes("número de empleados")) {
      return "El número de empleados indica la cantidad de personas contratadas que trabajan para la empresa.";
    }

    if (input.includes("cómo sé si la empresa está bien económicamente")) {
      return "Para saberlo, debes evaluar sus activos, deudas, ganancias y cartera. Si los activos y ganancias son mayores que las deudas, está en buena salud financiera.";
    }

    if (
      input.includes("qué datos debo ingresar") ||
      input.includes("parámetros")
    ) {
      return "Debes ingresar el nombre de la empresa, ganancias anuales, sector, número de empleados, valor en activos, cartera y deudas.";
    }

    return "Lo siento, aún no tengo una respuesta para eso. Intenta preguntarme otra cosa. 😊";
  };

  return (
    <div className="chatbot-container">
      <div className="chat-toggle" onClick={handleToggle}>
        💬
      </div>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu mensaje..."
            />
            <button onClick={handleSend}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
