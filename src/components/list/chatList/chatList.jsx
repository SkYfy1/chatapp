import React, { useEffect, useState } from 'react'
import "./chatList.css"
import AddUser from './addUser/addUser'
import { useAuthStore } from '../../../context/useAuthStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import useChatStore from '../../../context/useChatStore';


const ChatList = ({ isMobile, toggle }) => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState();

  const currentUser = useAuthStore((state) => state.currentUser);
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
      const items = res.data().chats;
      // console.log(res.data())

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, 'users', item.receiverId);

        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...item, user }
      })

      const chatData = await Promise.all(promises);

      // console.log(chatData)

      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    })
    return () => unSub()
  }, [currentUser.id]);

  async function handleSelect(chat) {
    // const userChatsRef = doc(db, 'userchats', currentUser.id);
    // const userChatsSnapshot = await getDoc(userChatsRef);

    // if (userChatsSnapshot.exists()) {
    //   const userChatsData = userChatsSnapshot.data();

    //   const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

    //   userChatsData.chats[chatIndex].isSeen = true

    //   await updateDoc(userChatsRef, {
    //     chats: userChatsData.chats
    //   })
    // }

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

    {isMobile && toggle();}
  }

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder='Search' />
        </div>
        <img onClick={() => setAddMode(prev => !prev)} src={addMode ? './minus.png' : "./plus.png"} alt="" className='add' />
      </div>
      <div className="item">
        <img src='./avatar.png' alt="" />
        <div className='texts'>
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      {chats?.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe'
          }}
        >
          <img src={chat.user.avatar || './avatar.png'} alt="" />
          <div className='texts'>
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser show={addMode} />}
    </div>
  )
}

export default ChatList
