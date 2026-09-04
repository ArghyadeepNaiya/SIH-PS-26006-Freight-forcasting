import React, { useEffect, useState } from 'react';

const PortIntelligence = () => {
  const [ports, setPorts] = useState([]);
  
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/api/ports`);
        const data = await res.json();
        setPorts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPorts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass p-6">
        <h2 className="text-2xl font-bold mb-2">East Coast Port Constraints</h2>
        <p className="text-gray-400 text-sm">All values cited from official port authority documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ports.map((port, idx) => (
          <div key={idx} className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{port.name}</h3>
              <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-gray-300">{port.code}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b border-white/5 pb-2 group">
                <span className="text-gray-400 text-sm">Max Draft</span>
                <div className="text-right">
                  <span className="font-semibold text-white">{port.max_draft_m} m</span>
                  <a href={port.citations.max_draft_m} target="_blank" rel="noreferrer" className="block text-[10px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Source</a>
                </div>
              </div>
              
              <div className="flex justify-between border-b border-white/5 pb-2 group">
                <span className="text-gray-400 text-sm">Max LOA</span>
                <div className="text-right">
                  <span className="font-semibold text-white">{port.max_loa_m} m</span>
                </div>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2 group">
                <span className="text-gray-400 text-sm">Max Beam</span>
                <div className="text-right">
                  <span className="font-semibold text-white">{port.max_beam_m} m</span>
                </div>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2 group">
                <span className="text-gray-400 text-sm">Lightering</span>
                <div className="text-right">
                  <span className={`font-semibold ${port.lightering_available ? 'text-emerald-400' : 'text-red-400'}`}>
                    {port.lightering_available ? 'Available' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortIntelligence;
