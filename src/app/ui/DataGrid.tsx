import React from 'react';

import clsx from 'clsx';

type DataGridColumn<T> = {
  title: string;
  type?: string;
  field: keyof T;
  cellRender?: (row: T) => React.ReactNode;
};

type DataGridProps<T> = {
  columns: DataGridColumn<T>[];
  data: T[];
};

export default function DataGrid<T extends object>({
  columns,
  data,
}: DataGridProps<T>) {
  return (
    <div className="shadow-xl rounded-md overflow-x-auto">
      <table className="divide-y divide-gray-50 min-w-full overflow-hidden">
        <thead className="bg-slate-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column["title"]}
                className="px-5 py-3 font-medium text-gray-600 text-xs text-left uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition">
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${String(column["title"])}`}
                    className={clsx(
                      `px-5 py-3 text-gray-800 text-sm whitespace-nowrap`,
                      rowIndex % 2 === 0 && "bg-gray-100"
                    )}
                  >
                    {column.cellRender
                      ? column.cellRender(row)
                      : String(row[column.field] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="py-3 w-full text-center">No data</tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
