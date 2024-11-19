import React, { useEffect, useState } from 'react'
import "./chatList.css"
import AddUser from './addUser/addUser'
import { useAuthStore } from '../../../context/useAuthStore';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';


const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState();

  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
      const items = res.data().chats;
      console.log(res.data())

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, 'users', item.receiverId);

        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...item, user }
      })

      const chatData = await Promise.all(promises);

      setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt));
    })
    return () => unSub()
  }, [currentUser.id]);

  console.log(chats)
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
        <div className="item" key={chat.chatId}>
          <img src='./avatar.png' alt="" />
          <div className='texts'>
            <span>John Doe</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  )
}

export default ChatList
