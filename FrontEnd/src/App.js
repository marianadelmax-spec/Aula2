import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Components/Navbar';
import Produto from './Pages/Produtos';
import Home from './Pages/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Navigate to="/home" replace />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/Produtos" element={<Produto />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
