from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy

# Inicializar spaCy con el modelo para español
nlp = spacy.load("es_core_news_lg")  # Modelo de spaCy para español

# Crear la aplicación FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Dirección del frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Modelo para recibir datos del frontend
class EmpresaData(BaseModel):
    nombre: str
    ganancias: float
    sector: str
    empleados: int
    activos: float
    cartera: float
    deudas: float

@app.post("/process/")
def process_empresa(data: EmpresaData):
    # Procesar los datos de la empresa
    texto = f"La empresa {data.nombre} pertenece al sector {data.sector} y tiene {data.empleados} empleados."
    doc = nlp(texto)

    # Tokenización con spaCy
    tokens = [token.text for token in doc]

    # Lematización con spaCy
    lemmatized = [token.lemma_ for token in doc]

    # Postagging (etiquetado gramatical) con spaCy
    pos_tags = [(token.text, token.pos_) for token in doc]

    # Embedding (representación vectorial) con spaCy
    embeddings = {token.text: token.vector.tolist() for token in doc[:min(len(doc), 5)]}  # Solo los primeros 5 tokens para simplicidad

    # Análisis económico básico
    patrimonio = data.activos + data.cartera - data.deudas
    estado = "saludable" if patrimonio > 0 else "en riesgo"

    return {
        "empresa": data.nombre,
        "sector": data.sector,
        "empleados": data.empleados,
        "tokens": tokens,
        "lemmatized": lemmatized,
        "pos_tags": pos_tags,
        "embeddings": embeddings,
        "analisis_economico": {
            "ganancias": data.ganancias,
            "activos": data.activos,
            "cartera": data.cartera,
            "deudas": data.deudas,
            "patrimonio": patrimonio,
            "estado": estado,
        },
    }