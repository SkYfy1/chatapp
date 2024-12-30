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


const ChatList = ({ toggle }) => {
  const [addMode, setAddMode] = useState(false);
  // const [chats, setChats] = useState([]);
  const [filter, setFilter] = useState('');
  const [pointer, setPointer] = useState({ pointerX: null, pointerY: null });
  const appState = useAppStore();

  const currentUser = useAuthStore((state) => state.currentUser);
  const { userChats: chats, updateChats } = useAuthStore();
  const { changeChat } = useChatStore();
  const [trails, api] = useTrail(chats.length, () => ({
    from: {
      opacity: 0,
      x: -100,
    },
    to: {
      opacity: 1,
      x: 0
    }
  }))

  useEffect(() => {
    console.log(filter)
  }, [filter])

  // useEffect(() => {
  //   const getPointer = (e) => {
  //     setPointer({ pointerX: e.clientX, pointerY: e.clientY })
  //   }

  //   window.addEventListener('mousemove', getPointer)

  //   return () => {
  //     window.removeEventListener('mousemove', getPointer)
  //   }
  // }, [])

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
      const items = res.data().chats;
      console.log(items)

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, 'users', item.receiverId);

        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...item, user }
      })

      const chatData = await Promise.all(promises);

      updateChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    })
    return () => unSub()
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

  useEffect(() => {
    console.log(chats?.map((chat) => chat.chatId))
  }, [chats])

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder='Search' value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
        <img onClick={() => setAddMode(prev => !prev)} src={addMode ? './minus.png' : "./plus.png"} alt="" className='add' />
      </div>
      {trails.map(({ ...style }, index) =>
      (
        <animated.div style={style} key={index}>
          {chats?.filter((el) => el.user.username.toLowerCase().startsWith(filter.toLowerCase())).map((chat) => (
            !appState.isMobile ? <Tooltip key={chat.chatId} style={pointer} text={`${language.settings.tooltip[appState.appLanguage]}${chat.user.username}`}>
              <div
                className="item"
                onClick={() => handleSelect(chat)}
                onMouseMove={(e) => setPointer({ pointerX: e.clientX, pointerY: e.clientY })}
                style={{
                  backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe'
                }}
              >
                <img src={chat.user.blocked.includes(currentUser.id)
                  ? './avatar.png'
                  : chat.user.avatar || './avatar.png'} alt="" />
                <div className='texts'>
                  <span>{chat.user.blocked.includes(currentUser.id) ? 'User' : chat.user.username}</span>
                  <p>{chat.lastMessage}</p>
                </div>
              </div>
            </Tooltip> : <div
              key={chat.chatId}
              className="item"
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe'
              }}
            >
              <img src={chat.user.blocked.includes(currentUser.id)
                ? './avatar.png'
                : chat.user.avatar || './avatar.png'} alt="" />
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
    </div>
  )
}

export default ChatList
