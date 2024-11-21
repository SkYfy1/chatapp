import { auth, db } from '../lib/firebase'
import supabase from '../lib/supabase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc, collection, query, where, getDocs, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { toast } from 'react-toastify';

export class chatService {
    static async createChat(uid, fid) {
        try {
            const chatRef = collection(db, 'chat');
            const userChatRef = collection(db, 'userchats');


            const newChatRef = doc(chatRef)

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            })

            await updateDoc(doc(userChatRef, fid), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: uid,
                    updatedAt: Date.now(),
                })
            });

            await updateDoc(doc(userChatRef, uid), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: fid,
                    upadatedAt: Date.now(),
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
}