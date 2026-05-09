import React from 'react';
import { Minus, Plus, LayoutGrid, Lock } from 'lucide-react';

const CATEGORY_COLORS = {
  "Underweight": "#378ADD",
  "Normal":      "#D9FF00",
  "Overweight":  "#BA7517",
  "Obese":       "#E24B4A",
};

const NumberInput = ({ label, value, onChange, min, max, step = 1, unit = "", decimals = 0 }) => {
  const increment = () => onChange(Math.min(max, value + step));
  const decrement = () => onChange(Math.max(min, value - step));

  return (
    <div className="mb-5">
      <div className="text-[10px] font-bold text-[#555] uppercase tracking-[0.15em] mb-2">
        {label}{unit && ` (${unit})`}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={decrement}
          className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] text-white rounded-md border border-[#2a2a2a] hover:bg-[#222] active:scale-95 transition-all"
        >
          <Minus size={13} strokeWidth={3} />
        </button>
        <div className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md h-10 flex items-center justify-center">
          <input
            type="number"
            value={decimals > 0 ? value.toFixed(decimals) : value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full bg-transparent text-center text-white text-[14px] font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button
          onClick={increment}
          className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] text-white rounded-md border border-[#2a2a2a] hover:bg-[#222] active:scale-95 transition-all"
        >
          <Plus size={13} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ metrics, setMetrics, activeStandard, setActiveStandard, results }) => {
  const handleMetricChange = (name, value) => {
    setMetrics(prev => ({ ...prev, [name]: value }));
  };

  const standards = [
    { id: 'Global WHO Standard',      label: 'Global WHO Standard' },
    { id: 'Asian Clinical Standard',  label: 'Asian Clinical Standard' },
  ];

  return (
    <aside className="w-[320px] h-screen bg-[#111] border-r border-[#1e1e1e] flex flex-col shrink-0">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#D9FF00] rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(217,255,0,0.25)]">
          <LayoutGrid size={16} className="text-black" strokeWidth={3} />
        </div>
        <h1 className="text-[17px] font-black text-white tracking-tight leading-none">HealthAnalytics</h1>
        <div className="h-5 w-[1px] bg-[#2a2a2a]" />
        <span className="text-[12px] font-black text-white tracking-tight leading-tight">BMI Health<br/>Classifier</span>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-5 custom-scrollbar min-h-0">

        {/* BMI Standard */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-[#555] uppercase tracking-[0.15em] mb-2">
            Select Your BMI Standard
          </div>
          <div className="flex flex-col gap-1.5">
            {standards.map(std => {
              const active = activeStandard === std.id;
              return (
                <button
                  key={std.id}
                  onClick={() => setActiveStandard(std.id)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg border transition-all text-left ${
                    active
                      ? 'border-[#2a3a2a] bg-[#1a2a1a]'
                      : 'border-[#1e1e1e] bg-[#161616]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? 'border-[#378ADD]' : 'border-[#333]'
                  }`}>
                    {active && <div className="w-2 h-2 rounded-full bg-[#378ADD]" />}
                  </div>
                  <span className={`text-[11px] font-bold tracking-wide ${active ? 'text-white' : 'text-[#555]'}`}>
                    {std.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gender */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-[#555] uppercase tracking-[0.15em] mb-2">Gender</div>
          <div className="flex gap-1.5">
            {['Male', 'Female'].map(g => {
              const active = metrics.gender === g;
              return (
                <button
                  key={g}
                  onClick={() => handleMetricChange('gender', g)}
                  className={`flex-1 py-2.5 rounded-lg border text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
                    active
                      ? 'border-[#D9FF00] bg-[#D9FF00] text-black'
                      : 'border-[#1e1e1e] bg-[#161616] text-[#555]'
                  }`}
                >
                  {g === 'Male' ? '♂ Male' : '♀ Female'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Number inputs */}
        <NumberInput label="Age" value={metrics.age} onChange={(v) => handleMetricChange('age', v)} min={10} max={100} />
        <NumberInput label="Weight" unit="KG" value={metrics.weight} onChange={(v) => handleMetricChange('weight', v)} min={30} max={200} step={0.5} decimals={2} />
        <NumberInput label="Height" unit="CM" value={metrics.height} onChange={(v) => handleMetricChange('height', v)} min={100} max={220} />
        <NumberInput label="Hip" unit="CM" value={metrics.hip_cm} onChange={(v) => handleMetricChange('hip_cm', v)} min={60} max={160} />

        {/* Live Results */}
        {results && (
          <div className="mt-2 mb-4 rounded-lg bg-[#0d0d0d] border border-[#1e1e1e]">
            <div className="px-4 pt-4 pb-3 border-b border-[#1a1a1a]">
              <p className="text-[9px] font-black text-[#D9FF00] uppercase tracking-[0.2em] text-center">
                Live Calculation Results
              </p>
            </div>
            <div className="flex items-stretch px-3 py-2.5 gap-2">
              <div className="flex-1 text-center">
                <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.15em] mb-1">Your BMI</p>
                <p className="text-[30px] font-black text-white tracking-tighter leading-none">{results.bmi}</p>
                <p className="text-[12px] font-black uppercase tracking-[0.25em] mt-1" style={{ color: CATEGORY_COLORS[results.bmi_category] || '#D9FF00' }}>
                  {results.bmi_category}
                </p>
              </div>
              <div className="w-[1px] bg-[#1e1e1e]" />
              <div className="flex-1 text-center">
                <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.15em] mb-1">Your BAI</p>
                <p className="text-[30px] font-black text-[#8098FF] tracking-tighter leading-none">{results.bai}%</p>
                <p className="text-[12px] font-black uppercase tracking-[0.25em] mt-1" style={{ color: results.bai_category === 'Normal' ? '#8098FF' : (CATEGORY_COLORS[results.bai_category] || '#D9FF00') }}>
                  {results.bai_category === 'Normal' ? 'Healthy' : results.bai_category}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {results && (
          <div className="mb-5 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] p-4">
            <p className="text-[11px] font-black text-white uppercase tracking-wide mb-4">
              Your BMI {results.bmi} — Standard Comparison
            </p>
            <div className="flex text-[9px] font-bold text-[#444] uppercase tracking-tighter mb-2 px-1">
              <div className="w-[30%]">Standard</div>
              <div className="w-[23%] text-center">Overweight</div>
              <div className="w-[18%] text-center">Obese</div>
              <div className="w-[29%] text-right">Your Category</div>
            </div>
            <div className="space-y-1">
              {[
                { name: 'Global WHO',     over: '25.0+', obese: '30.0+', cat: results.global_bmi_category,  id: 'Global WHO Standard' },
                { name: 'Asian Clinical', over: '23.0+', obese: '27.5+', cat: results.asian_bmi_category,   id: 'Asian Clinical Standard' },
              ].map(s => (
                <div key={s.name} className={`flex items-center px-2 py-2.5 rounded-lg transition-all ${activeStandard === s.id ? 'bg-[#D9FF00]/5 ring-1 ring-[#D9FF00]/15' : ''}`}>
                  <div className={`w-[30%] text-[10px] font-black ${activeStandard === s.id ? 'text-[#D9FF00]' : 'text-white'}`}>{s.name}</div>
                  <div className="w-[23%] text-[10px] text-[#666] font-bold text-center">{s.over}</div>
                  <div className="w-[18%] text-[10px] text-[#666] font-bold text-center">{s.obese}</div>
                  <div className="w-[29%] text-[11px] font-black text-right uppercase italic" style={{ color: CATEGORY_COLORS[s.cat] || '#D9FF00' }}>{s.cat}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reference Table */}
        <div className="mb-6 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] p-4">
          <p className="text-[11px] font-black text-[#D9FF00] uppercase tracking-wide mb-4">Healthy Body Metric Targets</p>
          <div className="flex text-[8px] text-[#444] font-black uppercase tracking-tighter border-b border-[#1a1a1a] pb-2 mb-3 leading-tight">
            <div className="w-[13%]">Metric</div>
            <div className="w-[16%] text-center">Global<br/>BMI</div>
            <div className="w-[16%] text-center">Asian<br/>BMI</div>
            <div className="w-[19%] text-center">BAI<br/>18–39</div>
            <div className="w-[19%] text-center">BAI<br/>40–59</div>
            <div className="w-[17%] text-right">BAI<br/>60–70</div>
          </div>
          {[
            { label: 'Male',   g: '18.5–24.9', a: '18.5–22.9', b1: '8%–21%',  b2: '11%–23%', b3: '13%–25%' },
            { label: 'Female', g: '18.5–24.9', a: '18.5–22.9', b1: '21%–33%', b2: '23%–35%', b3: '25%–38%' },
          ].map((row, i) => (
            <div key={row.label} className={`flex items-center text-white ${i > 0 ? 'border-t border-[#1a1a1a] mt-2 pt-2' : ''}`}>
              <div className="w-[13%] text-[9px] font-black">{row.label}</div>
              <div className="w-[16%] text-[8px] font-bold text-center text-[#aaa]">{row.g}</div>
              <div className="w-[16%] text-[8px] font-bold text-center text-[#aaa]">{row.a}</div>
              <div className="w-[19%] text-[8px] font-bold text-center text-[#aaa]">{row.b1}</div>
              <div className="w-[19%] text-[8px] font-bold text-center text-[#aaa]">{row.b2}</div>
              <div className="w-[17%] text-[8px] font-bold text-right text-[#aaa]">{row.b3}</div>
            </div>
          ))}
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;