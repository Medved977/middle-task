import './App.css';

import React from 'react';
import { useEffect, useState, ChangeEvent } from 'react';

import { getUsers } from './api/users';
import { Users, IUser } from './types/User';
import { TableColumns, TableRow } from './types/common';

import Table from './components/Table/Table';
import Modal from './components/Modal/Modal';
import UserInfo from './components/UserInfo/UserInfo';


interface IFilters {
  [key: string]: any;
}

const columns: TableColumns = [
  { key: 'id', label: 'id', filterType: 'includes', clickable: true },
  { key: 'firstName', label: 'firstName', filterType: 'includes', clickable: true },
  { key: 'lastName', label: 'lastName', filterType: 'includes', clickable: true },
  { key: 'email', label: 'email', filterType: 'includes' },
  { key: 'gender', label: 'gender', filterType: 'equality' },
  { key: 'age', label: 'age', filterType: 'range' },
]

function App() {
  const [usersData, setUsersData] = useState<Users | null>(null);
  const [filteredData, setFilteredData] = useState<Users | null>(null);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isUsersLoading, setIsUsersLoading] = useState<Boolean>(true);

  const [isModalVisible, setIsModalVisible] = useState<Boolean>(false);

  const [filters, setFilters] = useState<IFilters>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    age: {
      start: '',
      end: '',
    },
  })

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsersData(res);
      })
      .finally(() => {
        setIsUsersLoading(false);
      })
  }, [])

  useEffect(() => {
    if (!usersData) return;

    const getDataWithFilters = (data: Users, filters: IFilters): Users => {
      const isEveryFiltersEmpty = Object.values(filters).every(filter => {
        if (typeof filter === 'string') {
          return !filter;
        } else if (typeof filter === 'object') {
          return Object.values(filter).every(filter => !filter)
        }

        return true;
      })

      if (isEveryFiltersEmpty) {
        return data;
      }

      return data.filter(row => {
        let isValid = true;

        for (let key in filters) {
          if (!filters[key]) continue;

          const filterType = columns.find(col => col.key === key)?.filterType;

          if (filterType === 'includes') {
            const invalidIncludes = !row[key as keyof IUser].toLowerCase().includes(filters[key].toLowerCase());

            if (invalidIncludes) {
              isValid = false;
            }
          }

          if (filterType === 'equality') {
            const invalidEquality = row[key as keyof IUser] !== filters[key];

            if (invalidEquality) {
              isValid = false;
            }
          }


          if (filterType === 'range') {
            const start = filters[key].start;
            const end = filters[key].end;

            if (!start && !end) {
              continue;
            }

            if (start && !end) {
              const inRange = +start <= +row[key as keyof IUser];

              if (!inRange) {
                isValid = false;
                continue;
              }

            }

            if (!start && end) {
              const inRange = +row[key as keyof IUser] <= +end;

              if (!inRange) {
                isValid = false;
                continue;
              }
            }

            if (start && end) {
              const inRange = +start <= +row[key as keyof IUser] && +row[key as keyof IUser] <= +end;

              if (!inRange) {
                isValid = false;
              }
            }
          }
        }

        return isValid;
      })
    }

    const data = getDataWithFilters(usersData, filters);

    setFilteredData(data);

  }, [filters, usersData])


  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  }

  const onRowClick = (row: TableRow) => {
    setSelectedUser(row as IUser);
    setIsModalVisible(true);
  }

  const onFiltersChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setFilters({ ...filters, [key]: e.target.value })
  }

  const onRangeChanged = (e: ChangeEvent<HTMLInputElement>, key: string, range: string) => {
    setFilters({
      ...filters,
      [key]: {
        ...filters[key],
        [range]: e.target.value,
      }
    })
  }

  const Filters = (
    <React.Fragment>
      <div className="mb-10">
        <div className="mb-10 filters-block">
          <input
            className="filter-input"
            value={filters.firstName}
            onChange={(e) => onFiltersChange(e, 'firstName')}
            placeholder="enter first name"
            type="text"
          />
          <input
            className="filter-input"
            value={filters.lastName}
            onChange={(e) => onFiltersChange(e, 'lastName')}
            placeholder="enter last name"
            type="text" />
        </div>

        <div className="mb-10 filters-block">
          <input
            value={filters.email}
            className="filter-input"
            onChange={(e) => onFiltersChange(e, 'email')}
            placeholder="enter email"
            type="text"
          />
          <input
            value={filters.id}
            className="filter-input"
            onChange={(e) => onFiltersChange(e, 'id')}
            placeholder="enter id"
            type="text"
          />
        </div>

        <div className="mb-10 filters-block">
          <input
            value={filters.age.start}
            className="filter-input"
            onChange={(e) => onRangeChanged(e, 'age', 'start')}
            placeholder="enter start age"
            type="text"
          />

          <input
            value={filters.age.end}
            className="filter-input"
            onChange={(e) => onRangeChanged(e, 'age', 'end')}
            placeholder="enter end age"
            type="text"
          />
        </div>

        <div className="mb-10 filters-block">
          <input
            type="radio"
            name="gender"
            value="male"
            id="male"
            checked={filters.gender === 'male'}
            onChange={(e) => onFiltersChange(e, 'gender')}
          />
          <label htmlFor="male">Male</label>

          <input
            type="radio"
            name="gender"
            value="female"
            id="female"
            checked={filters.gender === 'female'}
            onChange={(e) => onFiltersChange(e, 'gender')}
          />
          <label htmlFor="female">Female</label>
        </div>

        <button onClick={() => setFilters({ ...filters, gender: '' })}>Reset gender select</button>
      </div>
    </React.Fragment>
  )

  return (
    <div>
      <h1>Sortable Table</h1>

      {isUsersLoading ? 'Loading...' :
        <React.Fragment>
          <div className="mb-10">
            {Filters}
          </div>

          <Table columns={columns} data={filteredData} onRowClick={onRowClick} />

          {selectedUser ?
            <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
              <UserInfo user={selectedUser} />
            </Modal>
            : null}
        </React.Fragment>}
    </div>
  );
}

export default App;
