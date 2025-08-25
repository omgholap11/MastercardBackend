import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    //Update the chat history with the user message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    setTimeout(() => {
      //Adding the thinking placeholder for the bot message
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "Thinking..." },
      ]);

      //call the function to generate the bot message
      // Adding a prefix to each user message so the chatbot responds only based on the provided data
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Using the details provided above, please address the query: ${userMessage}`,
          // text: userMessage, // Simple Gemini Bot to perform according to you enable the above
        },
      ]);
    }, 600);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />
      <button type="submit" className="send-button">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7,7 17,7 17,17"></polyline>
        </svg>
      </button>
    </form>
  );
};

export default ChatForm;
