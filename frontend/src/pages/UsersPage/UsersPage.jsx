import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UsersPage.css';

const apiUrl = process.env.REACT_APP_API_URL;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSpamSummary = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiUrl}/messages/user_spam_summary?last_n=5`, {
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
        setUsers(data);
      } catch (err) {
        console.error('Error fetching user spam summary:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSpamSummary();
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleUserClick = (username) => {
    navigate(`/users/${username}`);
  };

  return (
    <div className="user-spam-summary">
      <button className="back-button" onClick={handleBackClick}>
        Вернуться на главную
      </button>
      
      <div className="content">
        <div className="top-bar">
          Список пользователей со спамом
        </div>
        
        <div className="summary-container">
          {loading ? (
            <div className="loading">Загрузка данных...</div>
          ) : error ? (
            <div className="error">Ошибка: {error}</div>
          ) : users.length === 0 ? (
            <div className="no-users">Пользователей не найдено</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Никнейм</th>
                  <th>Spam Score</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={index} 
                    className="user-row" 
                    onClick={() => handleUserClick(user.username)}
                  >
                    <td>{user.username}</td>
                    <td>{user.spam_score.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;