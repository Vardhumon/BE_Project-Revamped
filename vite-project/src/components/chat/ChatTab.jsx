import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast, { Toaster } from "react-hot-toast";

const ChatTab = ({ communityName }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);  
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

  const fetchMessages = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const API_BASE_URL = 'http://localhost:5000';
      const response = await fetch(
        `${API_BASE_URL}/api/chat/${communityName}/messages?page=${pageNum}&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) throw new Error(`Failed to fetch messages: ${response.status}`);
      
      const { messages: newMessages, hasMore: moreMessages } = await response.json();
      
      const processedMessages = newMessages.map(message => ({
        ...message,
        isOwnMessage: message.senderId._id === userRef.current?._id
      }));
  
      setMessages(prev => append ? [...processedMessages, ...prev] : processedMessages);
      setHasMore(moreMessages);
      setPage(pageNum);
    } catch (err) {
      console.error('Error loading chat history:', err);
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userRef.current) return;

    const API_BASE_URL = 'http://localhost:5000';
    
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

    const handleConnect = () => {
      setIsConnected(true);
      toast.success('Connected to chat server');
      fetchMessages(1, false);
      
      newSocket.emit('join_community', { 
        communityName, 
        userId: userRef.current._id 
      });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error('Connection error:', error);
    };

    const handleNewMessage = (message) => {
      setMessages(prev => {
        const messageExists = prev.some(m => 
          (m.tempId && message.content === m.content && m.isOwnMessage) || 
          (m._id && m._id === message._id)
        );
        
        if (messageExists) {
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
          return [...prev, {
            ...message,
            isOwnMessage: message.senderId === userRef.current?._id || message.userId === userRef.current?._id,
            pending: false
          }];
        }
      });
    };

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('new_message', handleNewMessage);
    newSocket.on('error', (error) => {
      toast.error(`Chat error: ${error.message || 'Unknown error'}`);
    });

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

  const handleScroll = async (e) => {
    const container = e.target;
    if (container.scrollTop === 0 && !loading && hasMore) {
      await fetchMessages(page + 1, true);
    }
  };

  const [replyingTo, setReplyingTo] = useState(null);
  
  const handleReply = (message) => {
    setReplyingTo({
      messageId: message._id,
      content: message.content,
      username: message.username
    });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    const messageContent = newMessage.trim();
    if (!messageContent || !userRef.current || !socketRef.current) return;
  
    const tempId = Date.now().toString();
    const messageData = {
      communityName,
      userId: userRef.current._id,
      username: userRef.current.name,
      content: messageContent,
      timestamp: new Date(),
      replyTo: replyingTo
    };
  
    setNewMessage('');
    setReplyingTo(null);
    
    try {
      const optimisticMessage = { 
        ...messageData, 
        tempId,
        isOwnMessage: true,
        pending: true 
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
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
      
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="chat-messages flex-grow overflow-y-auto mb-4 space-y-4 p-2"
      >
        {loading && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00ff9d] mx-auto"></div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={message._id || message.tempId || index}>
            {message.replyTo && (
              <div className={`mb-2 p-3 rounded-lg bg-white/80 text-sm text-gray-800 max-w-[50%] ${
                message.isOwnMessage ? 'ml-auto' : 'mr-auto'
              }`}>
                <div className={`${message.isOwnMessage ? 'text-right' : 'text-left'}`}>
                  Replying to {message.replyTo.username}
                </div>
                <div className={`truncate ${message.isOwnMessage ? 'text-right' : 'text-left'}`}>
                  {message.replyTo.content}
                </div>
              </div>
            )}
            
            <div className={`message p-3 rounded-lg max-w-[40%] ${
              message.pending ? 'opacity-60' : ''
            } ${
              message.isOwnMessage 
                ? 'ml-auto bg-[#00ff9d]/10 text-white' 
                : 'mr-auto bg-white/10 text-white'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <div 
                  onClick={() => navigate(`/profile/${message.senderId._id}`)}
                  className="text-sm text-gray-400 hover:text-[#00ff9d] cursor-pointer transition-colors"
                >
                  {message.username}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
              <div className="message-content break-words">{message.content}</div>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                <button 
                  onClick={() => handleReply(message)}
                  className="hover:text-[#00ff9d] transition-colors"
                >
                  Reply
                </button>
                {message.pending && <span>Sending...</span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="chat-input mt-auto ">
        {replyingTo && (
          <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg mb-2 max-w-[80%]">
            <div className="text-sm text-gray-400 max-w-[40%]">
              <span>Replying to {replyingTo.username}</span>
              <p className="text-xs truncate">{replyingTo.content}</p>
            </div>
            <button 
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-white ml-2"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected || !userRef.current}
            className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                      placeholder-gray-400 focus:outline-none focus:border-[#00ff9d]/50 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed "
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
        </div>
      </form>
    </div>
  );
};

export default ChatTab;