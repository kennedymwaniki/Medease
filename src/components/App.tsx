import { useState } from 'react'
import { ChatBotWidget } from 'chatbot-widget-ui'

const App = () => {
  // Save all messages conversation
  // Example: [{'role': 'user', 'content': 'hello'}, {'role': 'assistant', 'content': 'Hello, how can I assist you today!'}, ...]
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'user',
      content: 'hello',
    },
    {
      role: 'assistant',
      content: 'hi!',
    },
    {
      role: 'user',
      content: 'who are you',
    },
  ])

  const customApiCall = async (message: string): Promise<string> => {
    const response = await fetch('https://example.com/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage: message }),
    })
    const data = await response.json()
    return data.content
  }

  const handleBotResponse = (response: string) => {
    // Handle the bot's response here
    console.log('Bot Response:', response)
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'assistant', content: response },
    ])
  }

  const handleNewMessage = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  return (
    <div>
      <ChatBotWidget
        callApi={customApiCall}
        onBotResponse={handleBotResponse}
        handleNewMessage={handleNewMessage}
        messages={messages}
        primaryColor="#3498db"
        inputMsgPlaceholder="Type your message..."
        chatbotName="Medease assistant"
        isTypingMessage="Typing..."
        IncommingErrMsg="Oops! Something went wrong. Try again."
        chatIcon={<div>O</div>}
        botIcon={<div>B</div>}
        botFontStyle={{
          fontFamily: 'Arial',
          fontSize: '14px',
          color: 'red',
        }}
        typingFontStyle={{
          fontFamily: 'Arial',
          fontSize: '12px',
          color: '#888',
          fontStyle: 'italic',
        }}
        useInnerHTML={true}
      />
    </div>
  )
}

export default App
