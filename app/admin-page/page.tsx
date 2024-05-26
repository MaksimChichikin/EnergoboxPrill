'use client'; // Убедитесь, что эта строка добавлена первой

import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash } from 'react-feather'; // Импортируем иконки
import { useRouter } from 'next/navigation'; // Импортируем useRouter для маршрутизации

// Определение типа User
interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

// Функция для преобразования roleId в удобочитаемую строку
const getRoleName = (roleId: number): string => {
  switch (roleId) {
    case 1:
      return 'Пользователь';
    case 2:
      return 'Администратор';
    case 3:
      return 'Работник';
    default:
      return 'Неизвестная роль';
  }
};

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter(); // Получаем объект маршрутизации

  useEffect(() => {
    // Функция для получения данных из API
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5080/api/Users');
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEditUser = (userId: number) => {
    router.push(`/edit-user/${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    console.log(`Attempting to delete user with ID: ${userId}`); // Добавьте логирование
    setError(null);

    try {
      const response = await fetch(`http://localhost:5080/api/Users/${userId}`, {
        method: 'DELETE',
      });

      console.log(`Response status: ${response.status}`); // Логирование статуса ответа

      if (!response.ok) {
        setError('Ошибка при удалении пользователя');
        console.error(`Error deleting user with ID: ${userId}`); // Логирование ошибки
        return;
      }

      // Обновляем список пользователей после успешного удаления
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      setError('Произошла ошибка при удалении пользователя');
      console.error(`Exception while deleting user with ID: ${userId}`, error); // Логирование исключения
    }
  };

  const handleAddUserClick = () => {
    // Переход на страницу создания пользователя при нажатии на кнопку
    router.push('/create-user');
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.password.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoleName(user.roleId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm)
  );

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1">Административная страница</h1>
          </div>
          <div className="max-w-lg mx-auto">
            {/* Кнопка добавить пользователя */}
            <div className="mb-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddUserClick} // Обработчик нажатия на кнопку
              >
                <Plus className="w-5 h-5 inline-block mr-1" /> Добавить пользователя
              </button>
            </div>
            <div className="mb-6 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Поиск..."
                className="w-full p-3 pl-10 border border-gray-700 rounded-sm bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Значок поиска (иконка из Feather Icons) */}
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <h2 className="h2 mb-6">Список пользователей</h2>
              <ul className="space-y-4">
                {filteredUsers.map(user => (
                  <li key={user.id} className="border border-gray-700 rounded-sm p-4 flex flex-col space-y-2 relative">
                    <span className="text-sm text-gray-300">ID: {user.id}</span>
                    <span className="text-sm text-gray-300">ФИО: {user.fullName}</span>
                    <span className="text-sm text-gray-400">Email: {user.email}</span>
                    <span className="text-sm text-gray-400">Пароль: {user.password}</span>
                    <span className="text-sm text-gray-400">Роль: {getRoleName(user.roleId)}</span>
                    {/* Иконки редактирования и удаления */}
                    <div className="absolute top-0 right-0 mt-2 mr-2 flex space-x-2">
                      <button onClick={() => handleEditUser(user.id)}><Edit size={20} /></button>
                      <button onClick={() => handleDeleteUser(user.id)}><Trash size={20} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
