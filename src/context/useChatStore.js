import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const useChatStore = create((set) => ({
    chatId: null,
    chat: null,
    user: null,
    groupInfo: null,
    isReceiverBlocked: false,
    isUserBlocked: false,
    audioMessage: null,

    addAudio: (ent) => {
        set({ mediaRecorder: ent })
    },

    updateGroupInfo: (group) => {
        set({ groupInfo: group })
    },

    changeChat: (chatId, user, group) => {
        const currentUser = useAuthStore.getState().currentUser;
        // Check if group chat
        if (group) {
            return set({ groupInfo: group, chatId: chatId, user: null })
        }

        // CHECK IF CURRENT USER IS BLOCKED

        if (user.blocked.includes(currentUser.id)) {
            return set({ isUserBlocked: true, user: null, chatId: chatId, groupInfo: null })
        }

        // CHECK IF RECIEVER USER IS BLOCKED

        if (currentUser.blocked.includes(user.id)) {
            return set({ isReceiverBlocked: true, user, chatId: chatId, groupInfo: null })
        }

        set({ chatId: chatId, user: user, groupInfo: null })
    },

    updateChat: (data) => {
        set({ chat: data })
    },

    updateUserInfo: (data) => {
        set({ user: data })
    },

    changeBlock: () => {
        set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }))
    },

    closeChat: () => {
        set({ chatId: null })
    }
}))

export default useChatStore