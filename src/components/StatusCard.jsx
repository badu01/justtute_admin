function StatusCard({ label, value, color, percentage }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 bar-bg-emerald-500",
    amber: "bg-amber-50 text-amber-700 border-amber-100 bar-bg-amber-500",
    rose: "bg-rose-50 text-rose-700 border-rose-100 bar-bg-rose-500",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1 duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight ${colors[color].split(' bar')[0]}`}>
          {label}
        </span>
        <span className="text-xs font-bold text-gray-400">{percentage}%</span>
      </div>
      <h3 className="text-4xl font-black text-gray-900 mb-4">{value}</h3>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'}`} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}


export default StatusCard