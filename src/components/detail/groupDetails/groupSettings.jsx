import React, { useEffect, useState } from 'react'
import '../detail.css'
import useChatStore from '../../../context/useChatStore';
import { groupService } from '../../../services/groupService';
import { useAuthStore } from '../../../context/useAuthStore';

const GroupSettings = () => {
    const [img, setImg] = useState({
        file: null,
        url: null,
    });
    const [text, setText] = useState('');
    const [changeText, setChange] = useState(false);
    const [kickForm, setKickForm] = useState(false);

    const groupInfo = useChatStore(state => state.groupInfo);
    const chatId = useChatStore(state => state.chatId);

    useEffect(() => {
        groupInfo.groupName && setText(groupInfo.groupName)
    }, [])

    const members = groupInfo.members.map(members => members.id)

    const changeName = () => setChange(prev => !prev);

    const confirmChanging = async () => {
        await groupService.changeGroupName(members, chatId, text);
        setChange(prev => !prev);
    }
    return (
        <div className='groupSettings'>
            <div>
                {/* Чомусь якщо в лейблі елемент бтн, то не відкриваеться окно для додавання файлу ????? */}
                <label htmlFor='groupAvatar'>
                    <div className='btn-div'>Change group avatar</div>
                </label>
                <input type="file" id='groupAvatar' style={{ display: 'none' }} onChange={(e) => setImg({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })} />
            </div>
            <div className='nameChange'>
                <button style={{ width: changeText ? '50%' : '100%' }} onClick={changeText ? confirmChanging : changeName}>{changeText ? 'Confirm' : 'Change group name'}</button>
                {changeText && <input type="text" value={text} onChange={(e) => setText(e.target.value)} />}
            </div>
            <button onClick={() => setKickForm(prev => !prev)}>Kick users</button>
            {kickForm &&
                <div className='members'>
                    {/* Sdelat animaciy spiska!!~!!!!!!!!!!!!~~~!!~!~!~!~!!!!!~~!!!!! */}
                    {groupInfo.members.map((user) => (
                        <div className='userElem'>
                            <div className='userData'>
                                <img src={user.avatar} alt="avatar" />
                                <span>{user.username}</span>
                            </div>
                            <button>Kick user</button>
                        </div>
                    ))}
                </div>}
        </div>
    )
}

export default GroupSettings

{/* <div className='nameChange'>
<button style={{ width: changeText ? '50%' : '100%' }} onClick={() => setChange(prev => !prev)}>{changeText ? 'Confirm' : 'Change group name'}</button>
{changeText && <input type="text" value={text} onChange={(e) => setText(e.target.value)} />}
</div>
<button onClick={() => setKickForm(prev => !prev)}>Kick users</button>
{kickForm &&
<div className='members'>
    {/* Sdelat animaciy spiska!!~!!!!!!!!!!!!~~~!!~!~!~!~!!!!!~~!!!!! */}
// {groupInfo.members.map((user) => (
//     <div className='userElem'>
//         <div className='userData'>
//             <img src={user.avatar} alt="avatar" />
//             <span>{user.username}</span>
//         </div>
//         <button>Kick user</button>
//     </div>
// ))}
// </div>} */}
