import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversation: null,
      unreadCount: 0,

      // Create or get conversation
      getOrCreateConversation: (participantIds) => {
        const { conversations } = get();
        const sortedIds = [...participantIds].sort();
        const conversationId = sortedIds.join('-');

        let conversation = conversations.find((c) => c.id === conversationId);
        if (!conversation) {
          conversation = {
            id: conversationId,
            participants: participantIds,
            lastMessage: null,
            lastMessageTime: null,
            unread: 0,
            type: participantIds.length === 2 ? 'direct' : 'group',
          };
          set((prev) => ({
            conversations: [...prev.conversations, conversation],
            messages: { ...prev.messages, [conversationId]: [] },
          }));
        }
        return conversation;
      },

      // Send message
      sendMessage: (conversationId, senderId, content, type = 'text') => {
        const message = {
          id: `msg-${Date.now()}-${Math.random()}`,
          conversationId,
          senderId,
          content,
          type,
          timestamp: new Date().toISOString(),
          read: false,
        };

        set((prev) => {
          const conversation = prev.conversations.find((c) => c.id === conversationId);
          const updatedConversations = prev.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: content,
                  lastMessageTime: message.timestamp,
                  unread: c.participants.filter((p) => p !== senderId).reduce((sum, p) => sum + 1, 0),
                }
              : c
          );

          return {
            conversations: updatedConversations,
            messages: {
              ...prev.messages,
              [conversationId]: [...(prev.messages[conversationId] || []), message],
            },
            unreadCount: updatedConversations.reduce((sum, c) => sum + c.unread, 0),
          };
        });

        return message;
      },

      // Mark messages as read
      markAsRead: (conversationId, userId) => {
        set((prev) => {
          const updatedMessages = { ...prev.messages };
          if (updatedMessages[conversationId]) {
            updatedMessages[conversationId] = updatedMessages[conversationId].map((msg) =>
              msg.senderId !== userId ? { ...msg, read: true } : msg
            );
          }

          const updatedConversations = prev.conversations.map((c) =>
            c.id === conversationId ? { ...c, unread: 0 } : c
          );

          return {
            messages: updatedMessages,
            conversations: updatedConversations,
            unreadCount: updatedConversations.reduce((sum, c) => sum + c.unread, 0),
          };
        });
      },

      // Set active conversation
      setActiveConversation: (conversationId) => {
        set({ activeConversation: conversationId });
        // Mark as read will be handled by component
      },

      // Get messages for conversation
      getMessages: (conversationId) => {
        const { messages } = get();
        return messages[conversationId] || [];
      },

      // Get unread count for user
      getUnreadCount: (userId) => {
        const { conversations, messages } = get();
        let count = 0;
        conversations.forEach((conv) => {
          if (conv.participants.includes(userId)) {
            const convMessages = messages[conv.id] || [];
            count += convMessages.filter(
              (msg) => msg.senderId !== userId && !msg.read
            ).length;
          }
        });
        set({ unreadCount: count });
        return count;
      },

      // Delete conversation
      deleteConversation: (conversationId) => {
        set((prev) => {
          const updatedMessages = { ...prev.messages };
          delete updatedMessages[conversationId];
          return {
            conversations: prev.conversations.filter((c) => c.id !== conversationId),
            messages: updatedMessages,
            activeConversation:
              prev.activeConversation === conversationId ? null : prev.activeConversation,
          };
        });
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);

export default useChatStore;
