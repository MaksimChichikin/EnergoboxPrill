'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

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

const WorkerPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

    if (!userId) {
      setError('Пользователь не авторизован');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:5080/api/Users/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData: User = await userResponse.json();
        setUser(userData);

        const clientsResponse = await fetch('http://localhost:5080/api/Users');
        if (!clientsResponse.ok) {
          throw new Error('Failed to fetch clients data');
        }
        const clientsData: User[] = await clientsResponse.json();
        setClients(clientsData.filter(user => user.roleId === 1));
      } catch (error) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChat = (clientId: number) => {
    router.push(`/chat/${clientId}`);
  };

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
            {user && (
              <div className="text-left">
                <h1 className="h1">{user.fullName}</h1>
                {user.email && (
                  <p className="text-sm text-gray-400">Email: {user.email}</p>
                )}
              </div>
            )}
          </div>
          <div>
            <h2 className="h2 mb-6">Пользователи</h2>
            <ul className="space-y-4">
              {clients.map(client => (
                <li key={client.id} className="border border-gray-700 rounded-sm p-4 flex items-center">
                  <div>
                    <p className="text-sm text-gray-300">ФИО: {client.fullName}</p>
                    {client.email && (
                      <p className="text-sm text-gray-400">Email: {client.email}</p>
                    )}
                  </div>
                  <button 
                    className="btn text-white bg-purple-600 hover:bg-purple-700 ml-auto"
                    onClick={() => handleChat(client.id)}
                  >
                    Открыть чат
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkerPage;
