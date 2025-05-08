import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import ClusterPage from './routes/ClusterPage';
import KMeansExplainer from './components/KMeansExplainer';
import SimulationSteps from './components/KMeansSimulate';
import AboutPage from './routes/AboutPage';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clusters" element={<ClusterPage />} />
        <Route path="/explain" element={<KMeansExplainer />} />
        <Route path="/simulate" element={<SimulationSteps />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}
