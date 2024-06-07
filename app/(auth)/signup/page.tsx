'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const checkPasswordStrength = (pass: string) => {
    let errors = [];
    if (pass.length < 10) {
      errors.push('длиннее 10 символов');
    }
    if (!/[A-Z]/.test(pass)) {
      errors.push('одну большую букву');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass)) {
      errors.push('один специальный символ');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const passwordErrors = checkPasswordStrength(password);
    if (passwordErrors.length > 0) {
      setError(`Пароль должен содержать хотя бы ${passwordErrors.join(', ')}.`);
      return;
    }

    try {
      const response = await fetch('http://localhost:5080/api/Users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, roleId: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to register');
      } else {
        setSuccess(true);
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
            <h1 className="h1">Регистрация</h1>
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
                  <p className="text-gray-400 text-sm mt-1" style={{ fontSize: '1rem' }}>
                    Пароль должен содержать хотя бы одну большую букву, один специальный символ и быть длиннее 10 символов.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button className="btn text-white bg-purple-600 hover:bg-purple-700 w-full" type="submit">
                    Регистрация
                  </button>
                </div>
              </div>
              {error && <p className="text-red-600 text-center mt-4">{error}</p>}
              {success && <p className="text-green-600 text-center mt-4">Регистрация прошла успешно!</p>}
            </form>
            <div className="text-gray-400 text-center mt-6">
              У вас уже есть аккаунт?{' '}
              <Link href="/signin" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">
                Войдите
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
