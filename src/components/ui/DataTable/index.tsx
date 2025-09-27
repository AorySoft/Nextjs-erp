"use client";

//import { defaultColor } from "@/utils/constant";
import React, { useState, useMemo } from "react";

interface Column {
  key: string;
  label: string;
  searchable?: boolean;
  sortable?: boolean;
  render?: (row: unknown, index: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: unknown[];
  defaultLimit?: number; // Optional initial rows per page
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  defaultLimit = 5,
}) => {
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultLimit);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  /** -----------------------------
   *  FILTERED DATA
   * ----------------------------- */
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.every((col) => {
        if (!filters[col.key]) return true;
        return String((row as Record<string, unknown>)[col.key] || "")
          .toLowerCase()
          .includes(filters[col.key].toLowerCase());
      })
    );
  }, [data, columns, filters]);

  /** -----------------------------
   *  PAGINATION LOGIC
   * ----------------------------- */
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <div className="w-[95%]">
      {/* Table Container */}
      <div className="overflow-scroll h-[500px]">
        <table
          className="border border-gray-300 w-auto table-auto"
          style={{ tableLayout: "auto" }} // allows dynamic width
        >
          <thead>
            <tr className={`bg-[#E9E9E9]`}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="border border-[#a1aab2] px-3 py-2 text-left whitespace-nowrap text-[12px] text-[#3e5569]"
                  style={{ height: "30px" }} // fixed height for headers
                >
                  {col.label}
                </th>
              ))}
            </tr>
            <tr className="bg-[#E9E9E9]">
              {columns.map((col) => (
                <th key={col.key} className="border border-[#a1aab2] px-2 py-1 whitespace-nowrap">
                  {col.searchable ? (
                    <input
                      type="text"
                      placeholder={``}
                      className="border border-[#a1aab2] bg-[#FFF] px-2 py-1 text-sm w-full rounded"
                      value={filters[col.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(col.key, e.target.value)
                      }
                      style={{ height: "25px" }} // uniform input height
                    />
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className="border-t border-b border-[#e9e9e9] border-l border-r border-l-transparent border-r-transparent px-3 py-2 whitespace-nowrap align-middle"
                      style={{ height: "30px" }} // ensures same row height
                    >
                      {col.render
                        ? col.render(row, idx)
                        : col.key === "sno"
                        ? (currentPage - 1) * rowsPerPage + idx + 1 // Serial number with pagination
                        : (row as Record<string, unknown>)[col.key] !==
                          undefined
                        ? String((row as Record<string, unknown>)[col.key])
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-3">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={rowsPerPage}
            onChange={handleLimitChange}
          >
            {[5, 10, 20, 50, 100].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};


export default DataTable;
