import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatsListPage.css';

const apiUrl = process.env.REACT_APP_API_URL;

const ChatsListPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatIds = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiUrl}/messages/unique_chat_ids`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setChats(data);
      } catch (err) {
        console.error('Error fetching chat IDs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatIds();
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleChatClick = (chatId) => {
    // Переход на страницу предупреждений для конкретного чата
    navigate(`/warnings/${chatId}`);
  };

  return (
    <div className="chats-list-page">
      <button className="back-button" onClick={handleBackClick}>
        Вернуться на главную
      </button>
      
      <div className="content">
        <div className="top-bar">
          Список чатов (ID)
        </div>
        
        <div className="menu">
          <div className="chats-list-box">
            {loading ? (
              <div className="loading">Загрузка чатов...</div>
            ) : error ? (
              <div className="error">Ошибка: {error}</div>
            ) : chats.length === 0 ? (
              <div className="no-chats">Чатов не найдено</div>
            ) : (
              <div className="chat-list">
                {chats.map(chatId => (
                  <div 
                    key={chatId} 
                    className="chat-item"
                    onClick={() => handleChatClick(chatId)}
                  >
                    Чат ID: {chatId}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsListPage;