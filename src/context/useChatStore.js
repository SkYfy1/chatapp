import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const useChatStore = create((set) => ({
    chatId: null,
    chat: null,
    user: null,
    isReceiverBlocked: false,
    isUserBlocked: false,
    audioMessage: null,

    addAudio: (ent) => {
        set({ mediaRecorder: ent })
    },

    changeChat: (chatId, user, group) => {
        const currentUser = useAuthStore.getState().currentUser;
        // Check if group chat
        if(group) {
            return set({ user: group, chatId: chatId })
        }

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
        set({ chat: data })
    },

    changeBlock: () => {
        set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }))
    },

    closeChat: () => {
        set({ chatId: null })
    }
}))

export default useChatStore