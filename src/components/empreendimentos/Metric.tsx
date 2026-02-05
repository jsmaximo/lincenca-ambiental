interface MetricProps {
  label: string;
  value: number;
  color: "green" | "yellow" | "orange" | "red";
}

export function Metric({ label, value, color }: MetricProps) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className={`rounded-lg p-3 text-center ${colors[color]}`}>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
