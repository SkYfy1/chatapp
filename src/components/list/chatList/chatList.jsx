import React, { useEffect, useState, useRef } from 'react'
import "./chatList.css"
import AddUser from './addUser/addUser'
import { useAuthStore } from '../../../context/useAuthStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import useChatStore from '../../../context/useChatStore';
import Tooltip from '../../ui/Tooltip';
import language from '../../../utils/language.js'
import useAppStore from '../../../context/useAppStore'
import { useTrail, animated } from '@react-spring/web';
import MiniAvatar from '../../ui/MiniAvatar.jsx';
import UserListElem from './userListElem/userListElem.jsx';
import Button from '../../ui/Button.jsx';


const ChatList = ({ toggle }) => {
  const [addMode, setAddMode] = useState(false);
  const [createButton, setCreateButton] = useState(false);
  // const [chats, setChats] = useState([]);
  const [filter, setFilter] = useState('');
  const [pointer, setPointer] = useState({ pointerX: null, pointerY: null });
  const appState = useAppStore();
  const listRef = useRef(null)

  const currentUser = useAuthStore((state) => state.currentUser);
  const { userChats: chats, updateChats } = useAuthStore();
  const changeChat = useChatStore(state => state.changeChat);
  // const { changeChat } = useChatStore();
  const chatId = useChatStore(state => state.chatId);
  const [trails, api] = useTrail(chats.length, () => ({
    from: {
      opacity: 0,
      x: -100,
    },
    to: {
      opacity: 1,
      x: 0
    }
  }));

  const anims = currentUser?.hasOwnProperty('settings') ? currentUser?.settings?.animations : true;
  const showBtn = () => appState.changeShowButton();

  useEffect(() => {
    if (!appState.creatingGroup) {
      listRef.current.addEventListener('mouseenter', showBtn);
      listRef.current.addEventListener('mouseleave', showBtn);
    }

    return () => {
      listRef.current.removeEventListener('mouseenter', showBtn);
      listRef.current.removeEventListener('mouseleave', showBtn);
    }
  }, [appState.creatingGroup])

  useEffect(() => {
    const unSubs = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
      const items = res.data().chats;
      console.log(items);
      console.log('sub')

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, 'users', item.receiverId);

        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...item, user }
      })

      const chatData = await Promise.all(promises);

      updateChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    })
    return () => unSubs()
  }, [currentUser.id]);

  async function handleSelect(chat) {
    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest;
    })

    // console.log(userChats);

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

    userChats[chatIndex].isSeen = true;

    // console.log(userChats[0]);

    await updateDoc(doc(db, 'userchats', currentUser.id), {
      chats: userChats
    })

    await changeChat(chat.chatId, chat.user);

    { appState.isMobile && toggle(); }
  }

  // useEffect(() => {
  //   console.log(chats?.map((chat) => chat.chatId));
  //   console.log(chats)
  // }, [chats])

  return (
    <div className='chatList' ref={listRef}>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder='Search' value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
        <img onClick={() => setAddMode(prev => !prev)} src={addMode ? './minus.png' : "./plus.png"} alt="" className='add' />
      </div>
      {trails.map(({ ...style }, index) =>
      (
        <animated.div style={anims ? style : {}} key={index}>
          {chats?.filter((el) => el.user.username.toLowerCase().startsWith(filter.toLowerCase())).map((chat) => (
            !appState.isMobile ? <Tooltip key={chat.chatId} style={pointer} text={`${language.settings.tooltip[appState.appLanguage]}${chat.user.username}`}>
              <div
                className="item"
                onClick={() => handleSelect(chat)}
                onMouseMove={(e) => setPointer({ pointerX: e.clientX, pointerY: e.clientY })}
                style={{
                  backgroundColor: !chat?.isSeen ? '#5183fe' : chatId === chat.chatId ? 'rgba(17, 25, 40, 0.5)' : 'transparent'
                }}
              >
                <UserListElem chat={chat} />
              </div>
            </Tooltip> :
              <div
                key={chat.chatId}
                className="item"
                onClick={() => handleSelect(chat)}
                style={{
                  backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe'
                }}
              >
                {chat.user.status === 'offline' ? <img src={chat.user.blocked.includes(currentUser.id)
                  ? './avatar.png'
                  : chat.user.avatar || './avatar.png'} alt="" /> : <MiniAvatar img={chat.user.blocked.includes(currentUser.id)
                    ? './avatar.png'
                    : chat.user.avatar || './avatar.png'} status={chat.user.status} />}
                <div className='texts'>
                  <span>{chat.user.blocked.includes(currentUser.id) ? 'User' : chat.user.username}</span>
                  <p>{chat.lastMessage}</p>
                </div>
              </div>
          ))[index]}
        </animated.div>
      )
      )}
      {addMode && <AddUser changeShow={() => setAddMode(false)} />}
      {appState.showButton && <Button>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
      </Button>}
      {appState.creatingGroup && <button onClick={appState.changeGroup} className='groupBtn'>Create Group</button>}
    </div>
  )
}

export default ChatList
