'use client'
import React, { useEffect, useState } from 'react';
import { Search } from 'react-feather';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  contents: string;
  timestamp: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

const ViewMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchMessagesAndUsers = async () => {
      try {
        const messagesResponse = await fetch('http://localhost:5080/api/messages');
        if (!messagesResponse.ok) {
          throw new Error('Failed to fetch messages');
        }
        const messagesData: Message[] = await messagesResponse.json();

        const usersResponse = await fetch('http://localhost:5080/api/Users');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData: User[] = await usersResponse.json();

        setMessages(messagesData);
        setUsers(usersData);
      } catch (error) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesAndUsers();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const filteredMessages = messages.filter(message =>
    message.contents.toLowerCase().includes(searchTerm) || // Поиск в содержании сообщения
    users.some(user =>
      user.fullName.toLowerCase().includes(searchTerm) && // Поиск по имени отправителя или получателя
      (user.id === message.senderId || user.id === message.receiverId)) ||
    formatTimestamp(message.timestamp).toLowerCase().includes(searchTerm) // Поиск по времени
  );

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          
          <div className="max-w-lg mx-auto">
            <div className="mb-6 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Поиск..."
                className="w-full p-3 pl-10 border border-gray-700 rounded-sm bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <h2 className="h2 mb-6">История сообщений</h2>
              <ul className="space-y-4">
                {filteredMessages.map(message => {
                  const sender = users.find(user => user.id === message.senderId);
                  const receiver = users.find(user => user.id === message.receiverId);

                  return (
                    <li key={message.id} className="border border-gray-700 rounded-sm p-4 flex flex-col space-y-2 relative">
                      
                      <span className="text-sm text-gray-300">Отправитель: {sender ? sender.fullName : 'Неизвестный отправитель'}</span>
                      <span className="text-sm text-gray-300">Получатель: {receiver ? receiver.fullName : 'Неизвестный получатель'}</span>
                      <span className="text-sm text-gray-400">Сообщение: {message.contents}</span>
                      <span className="text-sm text-gray-400">Время отправления: {formatTimestamp(message.timestamp)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewMessagesPage;
