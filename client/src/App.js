import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import AppRouter from "./routes";
import ToastProvider from "./context/toast.context";

function App() {
  return (
    <PrimeReactProvider>
      <main className="w-screen h-screen">
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </main>
    </PrimeReactProvider>
  );
}

export default App;
