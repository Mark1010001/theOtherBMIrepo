import React, { useState } from 'react';
import Charts from './Charts';
import { Info, LogOut } from 'lucide-react';

const Dashboard = ({ data, userResults, userMetrics, onLogout }) => {
  const [activeTab, setActiveTab] = useState('BMI DISTRIBUTION');
  const { patterns, chart_data } = data;

  const CATEGORY_COLORS = {
    "Underweight": "#378ADD",
    "Normal":      "#D9FF00",
    "Overweight":  "#BA7517",
    "Obese":       "#E24B4A",
  };

  const tabs = [
    "BMI DISTRIBUTION",
    "BAI DISTRIBUTION",
    "AVG BMI BY AGE",
    "AGE VS BMI + TREND",
    "RISK DISPARITY",
  ];

  const categories = ["Underweight", "Normal", "Overweight", "Obese"];

  return (
    <div className="flex-1 p-8 flex flex-col gap-10 overflow-y-auto custom-scrollbar">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Population Patterns Dashboard</h2>
        <button
          onClick={onLogout}
          className="p-2 rounded-lg border border-[#222] bg-[#1a1a1a] text-[#555] hover:text-[#E24B4A] hover:border-[#E24B4A]/30 transition-all active:scale-95"
          title="Sign Out"
        >
          <LogOut size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Users', value: patterns.total_users },
          { label: 'Avg BMI', value: patterns.overall_avg_bmi },
          { label: 'Avg BAI', value: `${patterns.overall_avg_bai}%` },
          { label: 'Std Dev', value: patterns.bmi_std },
          { label: 'BMI=BAI Agree', value: `${Math.round(patterns.agreement_count / patterns.total_users * 100)}%`, brand: true },
        ].map((kpi, i) => (
          <div key={i} className={`metric-card flex flex-col items-center justify-center ${kpi.brand ? 'border-[#D9FF0055]' : ''}`}>
            <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-3">{kpi.label}</p>
            <p className={`text-4xl font-bold tracking-tight ${kpi.brand ? 'text-[#D9FF00]' : 'text-white'}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div>
        <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-6">Risk Category Breakdown (BMI Standard)</p>
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-4 gap-8">
            {categories.map(cat => {
              const count = patterns.category_counts[cat] || 0;
              const pct = Math.round((count / patterns.total_users) * 100);
              return (
                <div key={cat} className="flex flex-col items-center">
                  <p className="text-[10px] font-bold text-[#444] uppercase mb-2">{cat}</p>
                  <p className="text-3xl font-bold mb-1" style={{ color: CATEGORY_COLORS[cat] }}>{count}</p>
                  <p className="text-[10px] font-bold text-[#444]">{pct}%</p>
                </div>
              );
            })}
          </div>

          {/* Multi-segmented Progress Bar */}
          <div className="h-2 w-full flex rounded-full overflow-hidden">
            {categories.map(cat => {
              const count = patterns.category_counts[cat] || 0;
              const pct = (count / patterns.total_users) * 100;
              return (
                <div
                  key={cat}
                  style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] }}
                  className="h-full"
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Insight Banner */}
      <div className="p-5 rounded-xl bg-[#D9FF0008] border border-[#D9FF0015] flex items-start gap-4">
        <div className="p-2 rounded-lg bg-[#a78bfa22]">
          <Info size={18} className="text-[#a78bfa]" />
        </div>
        <p className="text-[13px] leading-relaxed text-[#888]">
          <b className="text-[#a78bfa]">Risk Disparity Insight:</b>
          <b className="text-white mx-1">{patterns.disparity_count} out of {patterns.total_users} users</b>
          are classified as <b className="text-white">'Normal'</b> under WHO standard but
          <b className="text-orange-400 mx-1">'High Risk'</b> under ethnic-adjusted thresholds.
          <span className="mx-2 text-[#444]">|</span>
          <b className="text-brand">{patterns.agreement_count} users</b> get the same category from both BMI and BAI.
        </p>
      </div>

      {/* Tabs and Charts */}
      <div className="flex flex-col gap-6">
        <div className="flex gap-10 border-b border-[#222]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[11px] font-bold tracking-widest transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-[#444] hover:text-[#666]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand shadow-[0_0_8px_#D9FF00]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <Charts
            activeTab={activeTab}
            patterns={patterns}
            chartData={chart_data}
            userResults={userResults}
            userMetrics={userMetrics}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;