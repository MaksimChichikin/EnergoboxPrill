'use client'; // Убедитесь, что эта строка добавлена первой

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number; // Добавлено поле id
  email: string;
  password: string;
  roleId: number; // Добавлено поле roleId
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5080/api/users'); // Измененный URL запроса
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const users: User[] = await response.json();
      
      // Логирование полученных данных
      console.log('Fetched users:', users);

      const user = users.find((user) => user.email === email && user.password === password);

      if (user) {
        if (rememberMe) {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
          localStorage.setItem('userId', user.id.toString()); // Save userId
        } else {
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('password', password);
          sessionStorage.setItem('userId', user.id.toString()); // Save userId
        }
        
        // Перенаправление в зависимости от роли пользователя
        switch (user.roleId) {
          case 1: // Пользователь
            router.push('/client-page');
            break;
          case 2: // Администратор
            router.push('/admin-page');
            break;
          case 3: // Работник
            router.push('/rab-page');
            break;
          default:
            setError('Неизвестная роль пользователя');
        }
      } else {
        setError('Неправильный логин или пароль');
      }
    } catch (err) {
      console.error('Error during sign-in:', err);
      setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1">Авторизация</h1>
          </div>

          <div className="max-w-sm mx-auto">
            <form onSubmit={handleSignIn}>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">Почта</label>
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
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">Пароль</label>
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
                  <div className="flex justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)} 
                      />
                      <span className="text-gray-400 ml-2">Запомнить меня</span>
                    </label>
                    <Link href="/reset-password" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Забыли пароль?</Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button className="btn text-white bg-purple-600 hover:bg-purple-700 w-full" type="submit">Вход</button>
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-center mt-6">
                  {error}
                </div>
              )}
            </form>
            <div className="text-gray-400 text-center mt-6">
              У вас нет аккаунта? <Link href="/signup" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Зарегистрируйся</Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
