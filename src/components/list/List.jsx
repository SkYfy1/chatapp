import React, { useState, useEffect } from 'react'
import './list.css'
import UserInfo from './userInfo/UserInfo'
import ChatList from './chatList/chatList'


const List = ({ isMobile, toggle }) => {
  const [showBurger, setShowBurger] = useState(false)
  if (isMobile) {
    return (
      showBurger ?
        <div className='burger' onClick={() => setShowBurger(!showBurger)}>
          <div className='burger-line'></div>
          <div className='burger-line'></div>
          <div className='burger-line'></div>
        </div> : <div className={'list'}>
          <UserInfo />
          <ChatList isMobile={isMobile} toggle={() => setShowBurger(!showBurger)} />
        </div>
    )
  }
  return (
    <div className={'list'}>
      <UserInfo />
      <ChatList isMobile={isMobile} toggle={toggle} />
    </div>
  )
}
export default List
