import './App.css';

import React from 'react';
import { useEffect, useState, ChangeEvent } from 'react';

import { getUsers } from './api/users';
import { Users, IUser } from './types/User';
import { TableColumns } from './types/common';

import Table from './components/Table/Table';
import Modal from './components/Modal/Modal';
import UserInfo from './components/UserInfo/UserInfo';


interface IFilters {
  [key: string]: string;
}

const columns: TableColumns = [
  { key: 'id', label: 'id', clickable: true },
  { key: 'firstName', label: 'firstName', clickable: true },
  { key: 'lastName', label: 'lastName', clickable: true },
  { key: 'email', label: 'email' },
  { key: 'age', label: 'age' },
  { key: 'gender', label: 'gender' },
]

function App() {
  const [usersData, setUsersData] = useState<Users | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isUsersLoading, setIsUsersLoading] = useState<Boolean>(true);

  const [isModalVisible, setIsModalVisible] = useState<Boolean>(false);

  const [filters, setFilters] = useState<IFilters>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
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

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  }

  const onRowClick = (user: IUser) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  }

  const onFiltersChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setFilters({ ...filters, [key]: e.target.value })
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
            value={filters.age}
            className="filter-input"
            onChange={(e) => onFiltersChange(e, 'age')}
            placeholder="enter age"
            type="text"
          />
        </div>

        <div className="mb-10 filters-block">
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

          <Table data={usersData} columns={columns} onRowClick={onRowClick} />

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
