interface Datum {
  label: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: "bar" | "donut";
  data: Datum[];
}

function maxValue(data: Datum[]) {
  return Math.max(1, ...data.map((d) => d.value));
}

export function ChartCard({ title, subtitle, type, data }: ChartCardProps) {
  const max = maxValue(data);
  return (
    <div className="glass-card space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">{title}</p>
        {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-white/60">No data available.</p>
      ) : type === "bar" ? (
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.label}>
              <div className="flex justify-between text-xs text-white/70">
                <span>{d.label}</span>
                <span>{d.value}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${(d.value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="relative h-28 w-28">
            {(() => {
              const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
              let offset = 0;
              return data.map((d) => {
                const percent = d.value / total;
                const strokeDasharray = `${percent * 100} ${100 - percent * 100}`;
                const circle = (
                  <circle
                    key={d.label}
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={-offset * 100}
                    className="text-white"
                    style={{ opacity: 0.7 }}
                  />
                );
                offset += percent;
                return circle;
              });
            })()}
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/80">{data[0].value ? `${data[0].value}` : ""}</div>
            <svg viewBox="0 0 100 100" className="absolute inset-0">
              {(() => {
                const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
                let offset = 0;
                const colors = ["#60a5fa", "#a855f7", "#22d3ee", "#f472b6", "#fbbf24"];
                return data.map((d, idx) => {
                  const percent = d.value / total;
                  const strokeDasharray = `${percent * 283} ${283 - percent * 283}`;
                  const el = (
                    <circle
                      key={d.label}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={colors[idx % colors.length]}
                      strokeWidth="10"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={-offset * 283}
                      strokeLinecap="round"
                    />
                  );
                  offset += percent;
                  return el;
                });
              })()}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
