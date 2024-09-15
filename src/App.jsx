import useAuth from "./hooks/useAuth";
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const {loading} = useAuth()

  if(loading) {
    return (
      <p className="text-4xl text-primary">Loading..</p>
    )
  }

  return (
    <div data-theme="light" className="min-h-screen">
      <ToastContainer />
      <AppRouter />
    </div>
  );
}

export default App;
