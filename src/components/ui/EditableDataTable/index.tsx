"use client";

import React, { useState, useEffect, useRef } from "react";
import EditableField from "./EditableField";

interface Column {
  key: string;
  label: string;
  editable?: boolean;
  type?: "input" | "select";
  options?: string[];
}

interface RowData {
  id: string | number;
  [key: string]: any;
}

interface EditableDataTableProps {
  columns: Column[];
  data: RowData[];
  onDataChange?: (updatedData: RowData[]) => void;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const EditableDataTable: React.FC<EditableDataTableProps> = ({
  columns,
  data,
  onDataChange,
  onSelectionChange,
}) => {
  const [tableData, setTableData] = useState<RowData[]>(data);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  const prevSelectedRef = useRef<(string | number)[]>([]);

  /** ✅ Sync tableData whenever parent data changes */
  useEffect(() => {
    // Only update if the incoming data is actually different
    if (JSON.stringify(data) !== JSON.stringify(tableData)) {
      setTableData(data);
    }
  }, [data, tableData]);

  /** ✅ Notify parent whenever selection changes */
  useEffect(() => {
    const selectedArray = [...selectedRows];

    // Only call parent callback when selection truly changes
    if (JSON.stringify(prevSelectedRef.current) !== JSON.stringify(selectedArray)) {
      prevSelectedRef.current = selectedArray;
      onSelectionChange?.(selectedArray);
    }
  }, [selectedRows, onSelectionChange]);

  /** -----------------------------
   *  UPDATE CELL VALUE
   * ----------------------------- */
  const handleCellChange = (rowId: string | number, key: string, value: string) => {
    const updated = tableData.map((row) =>
      row.id === rowId ? { ...row, [key]: value } : row
    );

    // ✅ Only call parent if data actually changed
    if (JSON.stringify(updated) !== JSON.stringify(tableData)) {
      setTableData(updated);
      onDataChange?.(updated);
    }
  };

  /** -----------------------------
   *  ROW SELECTION
   * ----------------------------- */
  const toggleRowSelection = (rowId: string | number) => {
    const updatedSelection = new Set(selectedRows);
    if (updatedSelection.has(rowId)) {
      updatedSelection.delete(rowId);
    } else {
      updatedSelection.add(rowId);
    }
    setSelectedRows(updatedSelection);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === tableData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(tableData.map((row) => row.id)));
    }
  };

  return (
    <div className="w-[95%] overflow-x-auto">
      <table className="border border-gray-300 w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            {/* Select All Checkbox */}
            <th className="border border-gray-300 px-3 py-2 text-center">
              <input
                type="checkbox"
                checked={selectedRows.size === tableData.length && tableData.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border border-gray-300 px-3 py-2 text-left text-sm text-gray-700"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {/* Row Checkbox */}
              <td className="border border-gray-300 text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.has(row.id)}
                  onChange={() => toggleRowSelection(row.id)}
                />
              </td>

              {/* Table Cells */}
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`border border-gray-300 text-sm ${!col.editable ? "p-1" : ""}`}
                >
                  {col.editable ? (
                    <EditableField
                      type={col.type || "input"}
                      value={row[col.key] || ""}
                      options={col.options}
                      onChange={(value) => handleCellChange(row.id, col.key, value)}
                    />
                  ) : (
                    row[col.key] || "-"
                  )}
                </td>
              ))}
            </tr>
          ))}

          {tableData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EditableDataTable;
