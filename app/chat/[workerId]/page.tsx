// Убедитесь, что эта строка добавлена первой
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  fullName: string;
  email: string;
}

interface Message {
  senderId: number;
  receiverId: number;
  contents: string;
  timestamp: string;
}

interface ChatPageProps {
  params: {
    workerId: string;
  };
}

const ChatPage: React.FC<ChatPageProps> = ({ params }) => {
  const { workerId } = params;
  const [worker, setWorker] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>(''); // Убедитесь, что установлено пустое значение по умолчанию
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (!userId) {
        router.push('/signin');
        return;
      }

      try {
        const userResponse = await fetch(`http://localhost:5080/api/Users/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData: User = await userResponse.json();
        setUser(userData);

        const workerResponse = await fetch(`http://localhost:5080/api/Users/${workerId}`);
        if (!workerResponse.ok) {
          throw new Error('Failed to fetch worker data');
        }
        const workerData: User = await workerResponse.json();
        setWorker(workerData);
      } catch (error) {
        console.error('Ошибка при загрузке данных', error);
      }
    };

    fetchUserData();
  }, [workerId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (!userId || !workerId) return;

      try {
        const response = await fetch(`http://localhost:5080/api/messages/${userId}/${workerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const messagesData: Message[] = await response.json();
        setMessages(messagesData);
      } catch (error) {
        console.error('Ошибка при получении сообщений', error);
      }
    };

    fetchMessages();

    const intervalId = setInterval(fetchMessages, 3000); // Обновление каждые 3 секунды

    return () => clearInterval(intervalId);
  }, [workerId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      senderId: user?.id,
      receiverId: parseInt(workerId, 10),
      contents: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(`http://localhost:5080/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setNewMessage('');
    } catch (error) {
      console.error('Ошибка при отправке сообщения', error);
    }
  };

  if (!worker || !user) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1">Чат с {worker.fullName}</h1>
            <div className="text-left">
              <div className="border border-gray-700 rounded-sm p-4 mb-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`text-sm text-gray-300 ${
                      message.senderId === user?.id ? 'text-left' : 'text-right'
                    }`}
                  >
                    {message.contents}
                  </div>
                ))}
              </div>
              <input
                type="text"
                className="form-input w-full text-gray-300 mb-4"
                placeholder="Введите сообщение"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                onClick={handleSendMessage}
              >
                Отправить
              </button>
            </div>
                </div>
              </div>
            </div>
          </section>
        );
      };
      
      export default ChatPage;
