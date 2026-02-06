function StatCard({ label, value, color, subtitle, border = "" }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-hover hover:shadow-md ${border}`}>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="mt-2 flex items-baseline">
        <h3 className={`text-4xl font-bold tracking-tight ${color}`}>{value}</h3>
      </div>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}

export default StatCard;