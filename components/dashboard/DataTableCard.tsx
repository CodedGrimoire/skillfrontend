import { ReactNode } from "react";

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => ReactNode;
}

interface Props<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  emptyText: string;
}

export function DataTableCard<T>({ title, columns, data, emptyText }: Props<T>) {
  return (
    <div className="glass-card">
      <p className="text-sm font-semibold text-white mb-3">{title}</p>
      {data.length === 0 ? (
        <p className="text-sm text-white/60">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-white/80">
            <thead>
              <tr className="text-left text-xs text-white/60">
                {columns.map((col) => (
                  <th key={String(col.key)} className="py-2 pr-4">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="py-2 pr-4">
                      {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
