import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from "react-hot-toast";

const ChatTab = ({ communityName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  
  // Get user from localStorage only once
  const userRef = useRef(JSON.parse(localStorage.getItem('user')));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userRef.current) return;

    const API_BASE_URL = 'http://localhost:5000';
    
    // Configure socket with better error handling and reconnection logic
    const newSocket = io(API_BASE_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/${communityName}/messages`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status}`);
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
          // Process messages to identify current user's messages
          const processedMessages = data.map(message => ({
            ...message,
            isOwnMessage: message.senderId._id === userRef.current?._id || message.userId === userRef.current?._id
          }));
          console.log('Received messages:', processedMessages);
          setMessages(processedMessages);
        } else {
          console.error('Invalid message data format received');
          setMessages([]);
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
        toast.error('Failed to load chat history');
        setMessages([]);
      }
    };

    // Socket event handlers
    const handleConnect = () => {
      setIsConnected(true);
      toast.success('Connected to chat server');
      fetchMessages();
      
      // Join room after successful connection
      newSocket.emit('join_community', { 
        communityName, 
        userId: userRef.current._id 
      });
    };

    const handleDisconnect = (reason) => {
      setIsConnected(false);
      // toast.error(`Disconnected: ${reason}`);
    };

    const handleConnectError = (error) => {
      console.error('Connection error:', error);
      // toast.error('Failed to connect to chat server');
    };

    const handleNewMessage = (message) => {
      setMessages(prev => {
        // Check if this message already exists in our messages array
        const messageExists = prev.some(m => 
          (m.tempId && message.content === m.content && m.isOwnMessage) || 
          (m._id && m._id === message._id)
        );
        
        if (messageExists) {
          // If message exists, replace temp message with confirmed one if needed
          return prev.map(m => {
            if (m.tempId && message.content === m.content && m.isOwnMessage) {
              return {
                ...message,
                isOwnMessage: message.senderId === userRef.current?._id || message.userId === userRef.current?._id,
                pending: false
              };
            }
            return m;
          });
        } else {
          // This is a new message
          return [...prev, {
            ...message,
            isOwnMessage: message.senderId === userRef.current?._id || message.userId === userRef.current?._id,
            pending: false
          }];
        }
      });
    };

    // Register event listeners
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('new_message', handleNewMessage);
    newSocket.on('error', (error) => {
      toast.error(`Chat error: ${error.message || 'Unknown error'}`);
    });

    // Clean up function
    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('leave_community', { communityName });
        socketRef.current.off('connect', handleConnect);
        socketRef.current.off('disconnect', handleDisconnect);
        socketRef.current.off('connect_error', handleConnectError);
        socketRef.current.off('new_message', handleNewMessage);
        socketRef.current.off('error');
        socketRef.current.disconnect();
      }
    };
  }, [communityName]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    const messageContent = newMessage.trim();
    if (!messageContent || !userRef.current || !socketRef.current) return;
  
    const tempId = `temp-${Date.now()}`;
  
    const messageData = {
      communityName,
      userId: userRef.current._id,
      username: userRef.current.name,
      content: messageContent,
      timestamp: new Date(),
    };
  
    setNewMessage('');
    
    try {
      // Add optimistic message to UI
      const optimisticMessage = { 
        ...messageData, 
        tempId,
        isOwnMessage: true,
        pending: true 
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
  
      // Emit through socket
      socketRef.current.emit('send_community_message', messageData);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Message failed to send');
      setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
    }
  };

  return (
    <div className="chat-container flex flex-col h-full">
      <div className="chat-status text-sm mb-2">
        {isConnected ? 
          <span className="text-green-400">●</span> : 
          <span className="text-red-400">●</span>
        }
        <span className="ml-2 text-gray-400">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      
      <div className="chat-messages flex-grow overflow-y-auto mb-4 space-y-4 p-2">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No messages yet. Start the conversation!
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={message._id || message.tempId || index}
            className={`message p-3 rounded-lg max-w-[80%] ${
              message.pending ? 'opacity-60' : ''
            } ${
              message.isOwnMessage 
                ? 'ml-auto bg-[#00ff9d]/10 text-white' 
                : 'mr-auto bg-white/10 text-white'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm text-gray-400">{message.username}</div>
              <div className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
            </div>
            <div className="message-content break-words">{message.content}</div>
            <div className="flex justify-end text-xs text-gray-500 mt-1">
              {message.pending && <span>Sending...</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="chat-input mt-auto flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected || !userRef.current}
          className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                    placeholder-gray-400 focus:outline-none focus:border-[#00ff9d]/50 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || !isConnected || !userRef.current}
          className="px-6 py-2 bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[#00ff9d] 
                  rounded-lg font-medium hover:bg-[#00ff9d]/20 transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatTab;