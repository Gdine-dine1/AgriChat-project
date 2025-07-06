import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);

  const scrollRef = useRef(null);
  const socketRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    // Send presence
    socketRef.current.emit("online", user?.username);

    // Fetch old messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/messages');
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();

    // Listen to new messages
    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Typing feedback
    socketRef.current.on('typing', (username) => {
      if (username !== user?.username) {
        setTypingUser(`${username} is typing...`);
        clearTimeout(window.typingTimeout);
        window.typingTimeout = setTimeout(() => setTypingUser(''), 2500);
      }
    });

    // Online count
    socketRef.current.on("usersOnline", (count) => {
      setOnlineCount(count);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user?.username]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (e) => {
    setContent(e.target.value);
    socketRef.current.emit("typing", user?.username);
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    const message = {
      sender: user?.username || "Anonymous",
      content,
    };

    socketRef.current.emit("sendMessage", message);
    setContent('');

    try {
      await axios.post('http://localhost:5000/api/messages', message);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setContent((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-4 h-[85vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-green-700">🌿 AgriChat Room</h2>
        <span className="text-sm text-gray-500">🟢 {onlineCount} online</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col space-y-3 border p-3 rounded bg-green-50 mb-2">
        {messages.map((msg, idx) => {
          const isOwn = msg.sender === user?.username;
          return (
            <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg text-sm shadow-md ${
                  isOwn
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-80 italic text-right">{msg.sender}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </div>

      {/* Typing indicator */}
      {typingUser && (
        <div className="text-sm italic text-gray-500 mb-1">{typingUser}</div>
      )}

      {/* Input */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShowEmoji((prev) => !prev)}
          className="text-2xl cursor-pointer"
        >
          😊
        </button>
        <input
          type="text"
          value={content}
          onChange={handleTyping}
          className="flex-1 border px-4 py-2 rounded focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>

      {showEmoji && (
        <div className="mt-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}

export default Chat;
