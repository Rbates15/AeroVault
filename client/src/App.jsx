import { AppProvider } from './context/AppContext.jsx';
import Home from './pages/Home.jsx';

function App() {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  );
}

export default App;
