import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const useChatStore = create((set) => ({
    chatId: null,
    chat: null,
    user: null,
    isReceiverBlocked: false,
    isUserBlocked: false,

    changeChat: (chatId, user) => {
        const currentUser = useAuthStore.getState().currentUser;
        // CHECK IF CURRENT USER IS BLOCKED

        if (user.blocked.includes(currentUser.id)) {
            return set({ isUserBlocked: true, user: null, chatId: chatId })
        }

        // CHECK IF RECIEVER USER IS BLOCKED

        if (currentUser.blocked.includes(user.id)) {
            return set({ isReceiverBlocked: true, user, chatId: chatId })
        }
        console.log('chat changing', chatId, user)

        set({ chatId: chatId, user: user })
    },

    updateChat: (data) => {
        set({ chat: data})
    },

    changeBlock: () => {
        set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }))
    }
}))

export default useChatStore