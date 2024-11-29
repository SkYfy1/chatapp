import React, { useState, useEffect } from 'react'
import './list.css'
import UserInfo from './userInfo/UserInfo'
import ChatList from './chatList/chatList'


const List = ({ isMobile, toggle }) => {
  return (
    <div className={'list'}>
      <UserInfo />
      <ChatList isMobile={isMobile} toggle={toggle}/>
    </div>
  )
}
export default List
