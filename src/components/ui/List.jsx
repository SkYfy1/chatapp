import React from 'react'
import { useTrail, a } from '@react-spring/web';
import { useAuthStore } from '../../context/useAuthStore';
import { groupService } from '../../services/groupService';
import useChatStore from '../../context/useChatStore';
import { toast } from 'react-toastify';

const List = ({ list }) => {
    const currentUser = useAuthStore((state) => state.currentUser);
    const anims = currentUser?.hasOwnProperty('settings') ? currentUser?.settings?.animations : true;
    const groupInfo = useChatStore(state => state.groupInfo);
    const chatId = useChatStore(state => state.chatId);

    const members = groupInfo.members.map(members => members.id);

    const [trails, api] = useTrail(list.length, () => ({
        from: {
            y: -30,
            opacity: 0
        },
        to: {
            y: 0,
            opacity: 1,
        }
    }));

    const handleKick = async (uid) => {
        await groupService.kickGroupUser(members, chatId, uid);
        toast.done('User kicked!')
    }

    return (
        <div className='members'>
            {
                trails.map(({ ...style }, index) => (
                    <a.div style={anims ? style : {}} key={index}>
                        {list.map((user) => (
                            <div className='userElem' key={user.username}>
                                <div className='userData'>
                                    <img src={user.avatar} alt="avatar" />
                                    <span>{user.username}</span>
                                </div>
                                <button onClick={() => handleKick(user.id)}>Kick user</button>
                            </div>
                        ))[index]}
                    </a.div>
                ))
            }
        </div>
    )
}

export default List
