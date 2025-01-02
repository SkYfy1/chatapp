import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthStore } from '../../../../context/useAuthStore'
import "../chatList.css"
import { db } from '../../../../lib/firebase';
import { useEffect } from 'react';
import MiniAvatar from '../../../ui/MiniAvatar';

const UserListElem = ({ chat }) => {
    const currentUser = useAuthStore((state) => state.currentUser);
    const { userChats: chats, updateChats } = useAuthStore();

    useEffect(() => {
        const unSube = onSnapshot(doc(db, 'users', chat.user.id), async (res) => {
            const user = res.data();

            // console.log(chats.find(el => el.user.username === user.username))

            const updatedChats = chats.map((el) => el.user.username === user.username ? { ...el, user: user } : el);

            updateChats(updatedChats.sort((a, b) => b.updatedAt - a.updatedAt));
        })
        return () => unSube()
    }, []);

    return (
        <>
            {chat.user.status && <MiniAvatar status={chat.user.status} img={chat.user.blocked.includes(currentUser.id)
                    ? './avatar.png'
                    : chat.user.avatar || './avatar.png'} />}
            <div className='texts'>
                <span>{chat.user.blocked.includes(currentUser.id) ? 'User' : chat.user.username}</span>
                <p>{chat.lastMessage}</p>
            </div>
        </>
    )
}

export default UserListElem
