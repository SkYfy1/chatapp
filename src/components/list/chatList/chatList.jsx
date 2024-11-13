import React, { useState } from 'react'
import "./chatList.css"

const ChatList = () => {
  const [addMode, setAddMode] = useState(false)
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
    </div>
  )
}

export default ChatList
