import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import companyInfo from "./companyinfo";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import translations from "./translations";
import multilingualCompanyInfo from "./multilingualCompanyInfo";
import "./Chatbot.css";

const ChatbotContent = () => {
  const { language, changeLanguage } = useLanguage();
  const t = translations[language];

  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: multilingualCompanyInfo[language],
    },
  ]);

  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  // Update chat history when language changes
  useEffect(() => {
    setChatHistory((prev) => [
      {
        hideInChat: true,
        role: "model",
        text: multilingualCompanyInfo[language],
      },
      ...prev.filter((msg) => !msg.hideInChat),
    ]);
  }, [language]);

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== t.thinking),
        { role: "model", text, isError },
      ]);
    };

    // Add system prompt in the selected language to ensure responses are in the correct language
    const systemPrompt = {
      role: "model",
      parts: [
        { text: t.systemPrompt + "\n\n" + multilingualCompanyInfo[language] },
      ],
    };

    history = [
      systemPrompt,
      ...history.map(({ role, text }) => ({ role, parts: [{ text }] })),
    ];

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
        .replace(/\*/g, "•") // Convert asterisks to bullet points
        .trim();

      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className={`chatbot-container ${showChatbot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
        className="chatbot-toggle"
      >
        {!showChatbot ? (
          <>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 15 3.06 16.28L2 22L7.72 20.94C9 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                fill="currentColor"
              />
            </svg>
            <span>{t.needHelp}</span>
          </>
        ) : (
          <>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{t.close}</span>
          </>
        )}
      </button>

      <div className="chatbot-popup">
        {/*Chat bot header*/}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">{t.chatbotName}</h2>
          </div>
          <div className="header-controls">
            {/* Language Selector */}
            <div className="language-selector">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-dropdown"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  marginRight: "8px",
                }}
              >
                <option value="english" style={{ color: "black" }}>
                  English
                </option>
                <option value="hindi" style={{ color: "black" }}>
                  हिंदी
                </option>
                <option value="marathi" style={{ color: "black" }}>
                  मराठी
                </option>
              </select>
            </div>
            <button
              onClick={() => setShowChatbot((prev) => !prev)}
              className="close-btn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 15L12 9L6 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/*Chat bot body*/}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">{t.welcomeMessage}</p>
          </div>

          {/*Render the chat history dynamically*/}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/*Chat bot footer*/}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
            translations={t}
          />
        </div>
      </div>
    </div>
  );
};

const Chatbot = () => {
  return (
    <LanguageProvider>
      <ChatbotContent />
    </LanguageProvider>
  );
};

export default Chatbot;
