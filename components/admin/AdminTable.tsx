import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyState?: ReactNode;
}

export default function AdminTable<T>({ columns, data, keyField, emptyState }: Props<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 text-center py-16">
        {emptyState ?? <p className="text-sm text-zinc-400">No data found.</p>}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto bg-white border border-zinc-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50">
            {columns.map((col) => (
              <th key={col.key} className={`text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-500 ${col.className ?? ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {data.map((row) => (
            <tr key={String(row[keyField])} className="hover:bg-zinc-50/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={`px-5 py-3.5 text-sm text-zinc-700 ${col.className ?? ''}`}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
