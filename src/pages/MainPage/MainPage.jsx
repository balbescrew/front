import React, { useState, useEffect } from "react";
import "./MainPage.css";
import { apiUrl } from "../../config";

const MainPage = () => {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unprocessedMessages, setUnprocessedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnprocessedMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/messages/unprocessed`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
      }

      const data = await response.json();
      setUnprocessedMessages(data);
      if (data.length > 0) {
        setCurrentMessage(data[data.length - 1]);
      } else {
        setCurrentMessage(null);
      }
    } catch (error) {
      console.error("Ошибка при загрузке сообщений:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnprocessedMessages();
  }, []);

  const processMessage = async (message, isSpam) => {
    if (!message || isProcessing) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${apiUrl}/messages/${message.chat_id}/${message.message_id}/process?is_spam=${isSpam}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_spam: isSpam,
        }),
      });

      if (response.ok) {
        const updatedMessages = unprocessedMessages.filter(
          (msg) => msg.message_id !== message.message_id
        );
        setUnprocessedMessages(updatedMessages);

        setCurrentMessage(
          updatedMessages.length > 0
            ? updatedMessages[updatedMessages.length - 1]
            : null
        );
      } else {
        console.error("Failed to process message:", await response.text());
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpamAction = () => {
    if (currentMessage) {
      processMessage(currentMessage, true);
    }
  };

  const handleNotSpamAction = () => {
    if (currentMessage) {
      processMessage(currentMessage, false);
    }
  };

  return (
    <div className="content">
      <div className="header-box">
        <h2>Панель управления</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="menu">
        {isLoading ? (
          <p>Загрузка сообщений...</p>
        ) : currentMessage ? (
          <>
            <div className="info-box">
              Пользователь: {currentMessage.user_username || "Аноним"}
            </div>

            <div className="chats-list-box">
              <div className="message-content">
                <div>{currentMessage.text || "Нет текста сообщения"}</div>
                {currentMessage.spam_score && (
                  <p className="spam-score">
                    Вероятность спама:{" "}
                    {(currentMessage.spam_score * 100).toFixed(2)}%
                  </p>
                )}
              </div>
            </div>

            <div className="spam-buttons">
              <button
                className="button spam-button"
                onClick={handleNotSpamAction}
                disabled={isProcessing}
              >
                {isProcessing ? "Обработка..." : "НЕ СПАМ"}
              </button>
              <button
                className="button spam-button spam"
                onClick={handleSpamAction}
                disabled={isProcessing}
              >
                {isProcessing ? "Обработка..." : "СПАМ"}
              </button>
            </div>
          </>
        ) : (
          <p>Нет непрочитанных сообщений</p>
        )}
      </div>

      <div className="menu-buttons">
        <button
          className="button"
          onClick={() => (window.location.href = "/users")}
        >
          Список пользователей
        </button>
        <button
          className="button"
          onClick={() => (window.location.href = "/chats")}
        >
          Список чатов
        </button>
      </div>
    </div>
  );
};

export default MainPage;
