"use client";

import React, { useState } from "react";

interface Column {
  key: string;
  label: string;
  searchable?: boolean;
  render?: (row: any, index: number) => React.ReactNode; // 👈 custom renderer
}

interface DataTableProps {
  columns: Column[];
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = data.filter((row) =>
    columns.every((col) => {
      if (!filters[col.key]) return true;
      return String(row[col.key] || "")
        .toLowerCase()
        .includes(filters[col.key].toLowerCase());
    })
  );

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="border p-2 text-left">
                {col.label}
              </th>
            ))}
          </tr>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="border p-1">
                {col.searchable ? (
                  <input
                    type="text"
                    placeholder={`Search ${col.label}`}
                    className="w-full border px-2 py-1 text-sm"
                    value={filters[col.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(col.key, e.target.value)
                    }
                  />
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col, i) => (
                  <td key={i} className="border p-2">
                    {col.render
                      ? col.render(row, idx) // 👈 use custom renderer if provided
                      : col.key === "sno"
                      ? idx + 1
                      : row[col.key] !== undefined
                      ? row[col.key]
                      : "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-3 text-gray-500"
              >
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
