import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UserMessagesPage.css";
import { apiUrl } from "../../config";

const UserMessagesPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${apiUrl}/messages/user_messages?username=${username}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Ошибка при загрузке данных: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Ошибка:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleBackClick = () => {
    navigate("/users"); // Возврат к списку пользователей
  };

  if (loading) return <div className="loading">Загрузка данных...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!userData)
    return <div className="no-data">Данные пользователя не найдены</div>;

  return (
    <div className="user-messages-container">
      <div className="header">
        <button onClick={handleBackClick} className="back-button">
          ← Назад к списку пользователей
        </button>
        <h2>Сообщения пользователя: {username}</h2>
      </div>

      <div className="user-info">
        <p>
          <strong>Spam Score:</strong> {userData.spam_score.toFixed(2)}
        </p>
      </div>

      <div className="messages-section">
        <h3>Последние сообщения:</h3>
        <ul className="messages-list">
          {userData.last_messages.map((message, index) => (
            <li key={index} className="message-item">
              <div className="message-content">{message}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserMessagesPage;
