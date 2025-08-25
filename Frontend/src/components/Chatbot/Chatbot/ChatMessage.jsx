import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
  // Function to format the message text with proper line breaks and formatting
  const formatMessage = (text) => {
    return text
      .split("\n")
      .map((line, index) => {
        const trimmedLine = line.trim();

        // Skip empty lines but add spacing
        if (!trimmedLine) {
          return <div key={index} className="line-break"></div>;
        }

        // Handle bullet points with various symbols
        if (trimmedLine.match(/^[•\-\*]\s/)) {
          return (
            <div key={index} className="bullet-point">
              {trimmedLine.substring(2)}
            </div>
          );
        }

        // Handle numbered lists
        else if (trimmedLine.match(/^\d+\.\s/)) {
          return (
            <div key={index} className="numbered-point">
              {trimmedLine}
            </div>
          );
        }

        // Handle headings (lines that end with :)
        else if (trimmedLine.endsWith(":") && trimmedLine.length < 50) {
          return (
            <div key={index} className="text-heading">
              {trimmedLine}
            </div>
          );
        }

        // Handle regular text lines
        else {
          return (
            <div key={index} className="text-line">
              {trimmedLine}
            </div>
          );
        }
      })
      .filter(Boolean); // Remove any null/undefined elements
  };

  return (
    !chat.hideInChat && (
      <div
        className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
          chat.isError ? "error" : ""
        }`}
      >
        {chat.role === "model" && <ChatbotIcon />}
        <div className="message-text">{formatMessage(chat.text)}</div>
      </div>
    )
  );
};

export default ChatMessage;
