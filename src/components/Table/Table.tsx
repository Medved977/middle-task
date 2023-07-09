import './Table.css';
import React, { useState, useMemo } from 'react';

import { IUser, Users } from '../../types/User';
import { TableColumns } from '../../types/common';


interface ITableProps {
  columns: TableColumns,
  data: Users | null,
  // FIXME: Здесь не должно быть упоминания юзеров, т.к. таблица не привязана к сущности
  onRowClick: (row: IUser) => void;
}

const Table = ({ columns, data, onRowClick }: ITableProps) => {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });


  const requestSort = (key: string) => {
    let direction = 'asc';

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }

    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    if (!data) return [];
    if (sortConfig === null) return data;

    const { key, direction } = sortConfig;

    return [...data].sort((a, b) => {
      if (a[key as keyof IUser] < b[key as keyof IUser]) {
        return direction === 'asc' ? -1 : 1;
      }

      if (a[key as keyof IUser] > b[key as keyof IUser]) {
        return direction === 'asc' ? 1 : -1;
      }

      return 0;
    })

  }, [data, sortConfig])

  const rowClickHandler = (row: IUser, clickable: Boolean) => {
    if (!clickable) return;

    onRowClick(row)
  }

  return (
    <React.Fragment>
      {sortedData.length ?
        <table className='table'>
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  onClick={() => requestSort(column.key)}
                  className={sortConfig && sortConfig.key === column.key ? `sort-${sortConfig.direction}` : ''}
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
                  <td onClick={() => { rowClickHandler(row, !!column.clickable) }} className={`${column.clickable ? 'table-row-pointer' : ''}`} key={column.key}>{row[column.key as keyof IUser]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table> : 'Here is no data, try to change filters'
      }
    </React.Fragment>
  )
}

export default Table