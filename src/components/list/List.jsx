import React, { useState, useEffect } from 'react'
import './list.css'
import UserInfo from './userInfo/UserInfo'
import ChatList from './chatList/chatList'
import useChatStore from '../../context/useChatStore'
import useAppStore from '../../context/useAppStore'


const List = ({ toggle, showDetails, openSettings }) => {
  const [showBurger, setShowBurger] = useState(false);
  const isMobile = useAppStore(state => state.isMobile);
  const closeChat = useChatStore((state) => state.closeChat);
  if (isMobile) {
    return (
      showBurger ?
        <div className={showDetails || 'burger'} onClick={() => setShowBurger(!showBurger)}>
          <div className='burger-line'></div>
          <div className='burger-line'></div>
          <div className='burger-line'></div>
        </div> : <div className={'list'}>
          <UserInfo openSettings={() => { openSettings(); closeChat() }} />
          <ChatList toggle={() => setShowBurger(!showBurger)} />
        </div>
    )
  }
  return (
    <div className={'list'}>
      <UserInfo openSettings={openSettings} />
      <ChatList toggle={toggle} />
    </div>
  )
}
export default List
