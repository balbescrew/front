import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./WarningsPage.css";

const apiUrl = "http://10.10.127.4/api";

const WarningsPage = () => {
  const navigate = useNavigate();
  const { chatId } = useParams(); // Получаем chatId из URL
  const [warnings, setWarnings] = useState([]);
  const [filteredWarnings, setFilteredWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных из БД
  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/warnings`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setWarnings(data);

        if (chatId) {
          const filtered = data.filter((warning) => warning.chatId === chatId);
          setFilteredWarnings(filtered);
        } else {
          setFilteredWarnings(data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке предупреждений:", error);
        setIsLoading(false);
      }
    };

    fetchWarnings();
  }, [chatId]);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleClearFilter = () => {
    navigate("/warnings");
  };

  return (
    <div className="warnings-page">
      <button className="back-button" onClick={handleBackClick}>
        Вернуться на главную
      </button>

      <div className="content-warnings">
        <div className="top-bar">
          {chatId ? `Предупреждения для чата ${chatId}` : "Все предупреждения"}
        </div>

        <div className="menu">
          <div className="chats-list-box">
            {isLoading ? (
              <div className="loading-message">Загрузка...</div>
            ) : filteredWarnings.length === 0 ? (
              <div className="no-warnings">
                {chatId
                  ? `Нет предупреждений для чата ${chatId}`
                  : "Нет предупреждений"}
              </div>
            ) : (
              filteredWarnings.map((warning, index) => (
                <button
                  key={warning.id || index}
                  className="chat-item-button"
                  onClick={() => navigate(`/warning/${warning.id}`)}
                >
                  <div>Предупреждение {index + 1}</div>
                  {!chatId && <div>Чат ID: {warning.chatId}</div>}
                  <div>Причина: {warning.message || warning.reason}</div>
                  {warning.messageContent && (
                    <div className="message-content">
                      Сообщение: {warning.messageContent}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningsPage;
