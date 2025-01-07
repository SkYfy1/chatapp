import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthStore } from '../../../../context/useAuthStore'
import "../chatList.css"
import { db } from '../../../../lib/firebase';
import { useEffect } from 'react';
import MiniAvatar from '../../../ui/MiniAvatar';
import useAppStore from '../../../../context/useAppStore';
import ControlledCheckbox from '../../../ui/Checkbox';

const UserListElem = ({ chat, type }) => {
    const currentUser = useAuthStore((state) => state.currentUser);
    const { userChats: chats, updateChats } = useAuthStore();
    const creatingGroup = useAppStore(state => state.creatingGroup);

    // Fix nado dlya obnovlenii ne chata, a esli user izmenit imya obnovit chat spisok!!!!!

    // useEffect(() => {
    //     const unSube = onSnapshot(doc(db, 'users', chat.user.id), async (res) => {
    //         const user = res.data();

    //         // console.log(chats.find(el => el.user.username === user.username))

    //         const updatedChats = chats.map((el) => el.user.username === user.username ? { ...el, user: user } : el);

    //         updateChats(updatedChats.sort((a, b) => b.updatedAt - a.updatedAt));
    //     })
    //     return () => unSube()
    // }, []);

    // Nujno 4toto sdelat so statusom gruppi

    if (type === 'group') {
        return (
            <>
                {/* dsadasdas */}
                {/* {chat.groupAvatar && <MiniAvatar status={'online'} img={chat.groupAvatar !== '' ? chat.groupAvatar : './avatar.png'} />} */}
                <MiniAvatar status={'dnd'} img={chat.groupAvatar !== '' ? chat.groupAvatar : './avatar.png'} />
                <div className='texts'>
                    <span style={{fontSize: '10px'}}>Group</span>
                    <span>{chat.groupName}</span>
                    <p>{chat.lastMessage}</p>
                </div>
            </>
        )
    }

    return (
        <>
            {chat.user.status && <MiniAvatar status={chat.user.status} img={chat.user.blocked.includes(currentUser.id)
                ? './avatar.png'
                : chat.user.avatar || './avatar.png'} />}
            <div className='texts'>
                <span>{chat.user.blocked.includes(currentUser.id) ? 'User' : chat.user.username}</span>
                <p>{chat.lastMessage}</p>
            </div>
            {creatingGroup && <ControlledCheckbox user={chat.user.id} />}
        </>
    )
}

export default UserListElem
