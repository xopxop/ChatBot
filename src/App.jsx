import { useState } from 'react'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT"
    }
  ]);

  async function onSend(message) {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map(messageObj => {
      return {
        role: messageObj.sender === "ChatGPT" ? "assistant" : "user",
        content: messageObj.message
      }
    });

    const systemMessage = {
      role: "system",
      content: "Speak like a pirate."
    };

    const payload = {
      "model": "gpt-3.5-turbo",
      "messages": apiMessages
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(data => {
      return data.json();
    }).then(data => {
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setTyping(false);
    });
  }

  return (
    <div style={{ position: "relative", height: "800px", width: "700px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior='smooth'
            typingIndicator={typing ? <TypingIndicator content="ChatGpt is typing"/> : null}
          >
            {
              messages.map((message, index) => {
                return <Message key={index} model={message} />
              })
            }
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={onSend}/>
        </ChatContainer>
      </MainContainer>
    </div>
  )
}

export default App
