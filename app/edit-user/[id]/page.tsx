'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const EditUserPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<number>(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { id } = useParams(); // Получаем id из URL

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5080/api/Users/${id}`);
        const user = await response.json();
        setFullName(user.fullName);
        setEmail(user.email);
        setPassword(user.password);
        setRoleId(user.roleId);
      } catch (err) {
        setError('Ошибка при загрузке данных пользователя');
      }
    };

    fetchUser();
  }, [id]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleId(Number(event.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const userData = { id: Number(id), fullName, email, password, roleId };

    console.log("Sending user data:", userData); // Логирование данных

    try {
      const response = await fetch(`http://localhost:5080/api/Users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update user');
      } else {
        setSuccess(true);
        router.push('/admin-page');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1">Редактирование пользователя</h1>
          </div>
          <div className="max-w-sm mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="full-name">
                    ФИО <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    className="form-input w-full text-gray-300"
                    placeholder="ФИО"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">
                    Почта <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input w-full text-gray-300"
                    placeholder="Введите вашу почту"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">
                    Пароль <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-input w-full text-gray-300"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="role">
                    Роль
                  </label>
                  <select
                    id="role"
                    className="form-select w-full text-gray-300"
                    value={roleId}
                    onChange={handleRoleChange}
                  >
                    <option value={1}>Пользователь</option>
                    <option value={2}>Администратор</option>
                    <option value={3}>Работник</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button className="btn text-white bg-purple-600 hover:bg-purple-700 w-full" type="submit">
                    Обновить пользователя
                  </button>
                </div>
              </div>
              {error && <p className="text-red-600 text-center mt-4">{error}</p>}
              {success && <p className="text-green-600 text-center mt-4">Пользователь успешно обновлен!</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditUserPage;
