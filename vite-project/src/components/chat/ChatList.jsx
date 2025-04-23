import { useState, useEffect } from 'react';
import ChatRoom from './ChatRoom';
import './ChatList.css';

const ChatList = ({ projectId, userId }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    // Fetch available chat rooms for the project
    fetch(`http://localhost:5000/api/chat/rooms/${projectId}`)
      .then(res => res.json())
      .then(data => setChatRooms(data))
      .catch(err => console.error('Error loading chat rooms:', err));
  }, [projectId]);

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
  };

  return (
    <div className="chat-container">
      <div className="chat-list">
        <h3>Chat Rooms</h3>
        <div className="chat-rooms">
          {chatRooms.map(room => (
            <div
              key={room._id}
              className={`chat-room-item ${activeChat === room._id ? 'active' : ''}`}
              onClick={() => handleChatSelect(room._id)}
            >
              <span className="room-name">{room.name}</span>
              {room.unreadCount > 0 && (
                <span className="unread-count">{room.unreadCount}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      {activeChat && (
        <div className="active-chat">
          <ChatRoom projectId={projectId} userId={userId} chatId={activeChat} />
        </div>
      )}
    </div>
  );
};

export default ChatList;