import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DecisionConsole from './pages/DecisionConsole';
import MarketForecast from './pages/MarketForecast';
import PortIntelligence from './pages/PortIntelligence';

function App() {
  return (
    <Router>
      <div className="min-h-screen p-6 md:p-12">
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between glass p-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Freight Forecast & Decision
            </h1>
            <p className="text-sm text-gray-400">SIH PS 26006</p>
          </div>
          
          <nav className="flex space-x-2 bg-black/20 p-1 rounded-lg border border-white/5">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-md transition-all duration-300 font-medium ${isActive ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'hover:bg-white/5 text-gray-300'}`
              }
            >
              Console
            </NavLink>
            <NavLink 
              to="/market" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-md transition-all duration-300 font-medium ${isActive ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'hover:bg-white/5 text-gray-300'}`
              }
            >
              Market
            </NavLink>
            <NavLink 
              to="/ports" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-md transition-all duration-300 font-medium ${isActive ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'hover:bg-white/5 text-gray-300'}`
              }
            >
              Ports
            </NavLink>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<DecisionConsole />} />
            <Route path="/market" element={<MarketForecast />} />
            <Route path="/ports" element={<PortIntelligence />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
