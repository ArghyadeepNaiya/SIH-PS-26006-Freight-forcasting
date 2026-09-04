import React from 'react';

const MarketForecast = () => {
  return (
    <div className="space-y-8">
      <div className="glass p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Market & Forecast</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Historical rates and forecasting models. Forecasts are shown with prediction intervals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 min-h-[300px] flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
           <p className="text-gray-500 relative z-10 text-center">
              <span className="block text-2xl mb-2">📈</span>
              Capesize Forecast Chart<br/>
              <span className="text-xs">(Requires Recharts integration)</span>
           </p>
        </div>
        
        <div className="glass p-6 space-y-4">
          <h3 className="text-xl font-bold">Forecast Honesty Panel</h3>
          
          <div className="space-y-4 mt-6">
            <div className="bg-black/30 p-4 rounded-lg border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-300">Capesize (30 Day Horizon)</span>
                <span className="text-emerald-400 font-bold">+15% Skill</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">15% improvement over naive persistence baseline.</p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-300">Handysize (90 Day Horizon)</span>
                <span className="text-red-400 font-bold">No Skill</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-red-400 h-2 rounded-full" style={{width: '20%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Model performs worse than assuming tomorrow equals today.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketForecast;
