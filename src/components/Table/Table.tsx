import "./Table.css";
import React, { useState, useMemo } from "react";
import { TableColumns, TableRow, TableData } from "../../types/common";

interface ITableProps {
  columns: TableColumns;
  data: TableData | null;
  onRowClick: (row: TableRow) => void;
}

const Table = ({ columns, data, onRowClick }: ITableProps) => {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const requestSort = (key: string) => {
    let direction = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!data) return [];
    if (sortConfig === null) return data;

    const { key, direction } = sortConfig;

    return [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }

      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [data, sortConfig]);

  const rowClickHandler = (row: TableRow, clickable: Boolean) => {
    if (!clickable) return;

    onRowClick(row);
  };

  return (
    <React.Fragment>
      {sortedData.length ? (
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => requestSort(column.key)}
                  className={
                    sortConfig && sortConfig.key === column.key
                      ? `sort-${sortConfig.direction}`
                      : ""
                  }
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td
                    onClick={() => {
                      rowClickHandler(row, !!column.clickable);
                    }}
                    className={`${column.clickable ? "table-row-pointer" : ""}`}
                    key={column.key}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "Here is no data, try to change filters"
      )}
    </React.Fragment>
  );
};

export default Table;
