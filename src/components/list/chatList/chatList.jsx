import React, { useEffect, useState } from 'react'
import "./chatList.css"
import AddUser from './addUser/addUser'
import { useAuthStore } from '../../../context/useAuthStore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';


const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState();

  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'userchats', currentUser.id), (doc) => {
      console.log(doc.data())
      setChats(doc.data().chats)
    })
    return () => unsub()
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
      <div className="item">
        <img src='./avatar.png' alt="" />
        <div className='texts'>
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src='./avatar.png' alt="" />
        <div className='texts'>
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src='./avatar.png' alt="" />
        <div className='texts'>
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src='./avatar.png' alt="" />
        <div className='texts'>
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      {addMode && <AddUser />}
    </div>
  )
}

export default ChatList
