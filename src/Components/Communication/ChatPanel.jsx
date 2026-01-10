import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  X, 
  Users, 
  Search,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';
import useChatStore from '../../store/useChatStore';
import useAuthStore from '../../store/useAuthStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import { format } from 'date-fns';

function ChatPanel({ isOpen, onClose }) {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const {
    conversations,
    activeConversation,
    messages,
    sendMessage,
    setActiveConversation,
    getMessages,
    markAsRead,
  } = useChatStore();

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const messagesEndRef = useRef(null);

  const currentMessages = activeConversation ? getMessages(activeConversation) : [];
  const currentConversation = conversations.find((c) => c.id === activeConversation);

  useEffect(() => {
    if (activeConversation && user?.id) {
      markAsRead(activeConversation, user.id);
    }
  }, [activeConversation, user, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation || !user?.id) return;

    sendMessage(activeConversation, user.id, messageText);
    setMessageText('');
  };

  const startConversation = (employeeId) => {
    const conversationId = [user.id, employeeId].sort().join('-');
    const conversation = useChatStore.getState().getOrCreateConversation([user.id, employeeId]);
    setActiveConversation(conversation.id);
    setSelectedEmployee(employees.find((e) => e.id === employeeId));
  };

  const getParticipantInfo = (conversation) => {
    if (!conversation || !user) return null;
    const otherParticipantId = conversation.participants.find((p) => p !== user.id);
    if (otherParticipantId) {
      return employees.find((e) => e.id === otherParticipantId);
    }
    return null;
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.id !== user?.id &&
    (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed right-0 top-0 h-full w-full md:w-96 bg-gray-900 z-50 shadow-2xl border-l border-white/10 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-white" size={24} />
            <h2 className="text-white font-semibold">Messages</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {!activeConversation ? (
          /* Employee List */
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-2">
              <div className="text-gray-400 text-sm px-2 mb-2">Online</div>
              {filteredEmployees
                .filter((e) => e.status === 'online')
                .map((employee) => (
                  <motion.button
                    key={employee.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startConversation(employee.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee.name.charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium">{employee.name}</div>
                      <div className="text-gray-400 text-sm">{employee.role} • {employee.department}</div>
                    </div>
                  </motion.button>
                ))}
              <div className="text-gray-400 text-sm px-2 mb-2 mt-4">Offline</div>
              {filteredEmployees
                .filter((e) => e.status === 'offline')
                .map((employee) => (
                  <motion.button
                    key={employee.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startConversation(employee.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2 opacity-60"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium">{employee.name}</div>
                      <div className="text-gray-400 text-sm">{employee.role} • {employee.department}</div>
                    </div>
                  </motion.button>
                ))}
            </div>
          </div>
        ) : (
          /* Chat View */
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ←
                </button>
                {(() => {
                  const participant = getParticipantInfo(currentConversation);
                  return participant ? (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {participant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{participant.name}</div>
                        <div className="text-gray-400 text-xs">
                          {participant.status === 'online' ? (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full" />
                              Online
                            </span>
                          ) : (
                            'Offline'
                          )}
                        </div>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                  <Phone size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                  <Video size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((message) => {
                const isOwn = message.senderId === user?.id;
                const sender = employees.find((e) => e.id === message.senderId);
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      {!isOwn && (
                        <div className="text-gray-400 text-xs mb-1 px-2">{sender?.name}</div>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isOwn
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <div>{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          isOwn ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {format(new Date(message.timestamp), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}

export default ChatPanel;
