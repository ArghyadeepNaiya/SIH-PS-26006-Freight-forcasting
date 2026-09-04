import React, { useState } from 'react';

const DecisionConsole = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    cargo_type: 'coking_coal',
    quantity_tonnes: 75000,
    origin: 'australia',
    earliest_arrival: '2026-11-01',
    latest_arrival: '2026-11-15'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Input Form */}
      <div className="glass p-6 space-y-6 h-fit">
        <div>
          <h2 className="text-xl font-bold mb-2">Cargo Requirement</h2>
          <p className="text-sm text-gray-400">Enter parameters to get optimal charter options.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Cargo Type</label>
            <select 
              value={formData.cargo_type} 
              onChange={e => setFormData({...formData, cargo_type: e.target.value})}
              className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-primary/50 transition-colors"
            >
              <option value="coking_coal">Coking Coal</option>
              <option value="thermal_coal">Thermal Coal</option>
              <option value="limestone">Limestone</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Quantity (Tonnes)</label>
            <input 
              type="number" 
              value={formData.quantity_tonnes} 
              onChange={e => setFormData({...formData, quantity_tonnes: Number(e.target.value)})}
              className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Origin</label>
            <select 
              value={formData.origin} 
              onChange={e => setFormData({...formData, origin: e.target.value})}
              className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-primary/50 transition-colors"
            >
              <option value="australia">Australia</option>
              <option value="usa">USA</option>
              <option value="mozambique">Mozambique</option>
              <option value="indonesia">Indonesia</option>
              <option value="russia">Russia</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Earliest</label>
              <input 
                type="date" 
                value={formData.earliest_arrival}
                onChange={e => setFormData({...formData, earliest_arrival: e.target.value})}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Latest</label>
              <input 
                type="date" 
                value={formData.latest_arrival}
                onChange={e => setFormData({...formData, latest_arrival: e.target.value})}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg shadow-lg transform transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Generate Decision'}
          </button>
        </form>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <>
            {/* Recommendation Banner */}
            <div className="glass-card p-6 border-l-4 border-l-emerald-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">✨</div>
              <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-1">Recommendation</h3>
              <h2 className="text-3xl font-bold mb-2">{result.recommendation.headline}</h2>
              <p className="text-gray-300">{result.recommendation.reason}</p>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-xl font-bold mb-4">Ranked Options</h3>
              <div className="space-y-4">
                {result.options.map((opt, i) => (
                  <div key={i} className="glass p-5 flex flex-col md:flex-row justify-between items-start md:items-center group">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">
                          {opt.vessel_class}
                        </span>
                        <span className="text-lg font-semibold">{opt.discharge_port}</span>
                        {opt.requires_lightering && (
                          <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs border border-amber-500/30">
                            Lightering Req.
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {opt.deliverable_tonnes.toLocaleString()}t deliverable ({opt.load_percentage}% of nominal)
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{opt.reason}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-3xl font-bold text-white">${opt.landed_cost_per_tonne}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Per Tonne</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rejections */}
            {result.rejected.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4 text-gray-400">Rejected Combinations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.rejected.map((rej, i) => (
                    <div key={i} className="bg-black/30 border border-red-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold">{rej.vessel_class} → {rej.discharge_port}</p>
                        <span className="text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded">Rejected</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Failed constraint: <span className="text-white font-medium uppercase">{rej.failed_constraint}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Required: {rej.required_value}, Limit: {rej.limit_value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center glass rounded-2xl min-h-[400px]">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">Run a scenario to see recommendations.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionConsole;
