import Header from './assets/components/Header';

function App() {
  return (
    <div>
      <Header />
      {/* Aquí iría el contenido principal */}
      <main className="mt-5 pt-5 text-center">
        <h1>Bienvenido a la evaluación económica</h1>
        <p>Ingresa los datos de tu empresa para iniciar.</p>
      </main>
    </div>
  );
}

export default App;

